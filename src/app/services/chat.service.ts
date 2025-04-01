import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concatMap,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Chat, Message, User } from 'src/models/app.model';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

interface TypingUser {
  userId: string;
  timestamp: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  private typingUsers = new Map<string, BehaviorSubject<TypingUser[]>>();

  createChat(name: string, members: string[]): Observable<Chat> {
    if (!name || !members || members.length === 0) {
      return throwError(
        () => new Error('Name and at least one member are required'),
      );
    }

    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((currentUser) => {
        if (!currentUser) {
          return throwError(
            () => new Error('User must be authenticated to create a chat'),
          );
        }

        if (!members.includes(currentUser.id)) {
          members = [...members, currentUser.id];
        }

        const chatsRef = collection(this.firestore, 'chats');
        const newChat: Omit<Chat, 'id'> = {
          name,
          members,
          lastMessage: null,
        };

        return from(
          addDoc(chatsRef, {
            ...newChat,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }),
        ).pipe(
          map((docRef) => ({
            id: docRef.id,
            ...newChat,
          })),
        );
      }),
      catchError((error) => {
        console.error('Error creating chat:', error);
        return throwError(() => error);
      }),
    );
  }

  getChatById(chatId: string): Observable<Chat | null> {
    if (!chatId) {
      return of(null);
    }

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    return docData(chatRef, { idField: 'id' }).pipe(
      map((chat) => (chat as Chat) || null),
      catchError((error) => {
        console.error(`Error fetching chat ${chatId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  getUserChats(userId: string): Observable<Chat[]> {
    if (!userId) {
      return of([]);
    }

    const chatsRef = collection(this.firestore, 'chats');
    const q = query(
      chatsRef,
      where('members', 'array-contains', userId),
      orderBy('updatedAt', 'desc'),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((chats) => chats as Chat[]),
      catchError((error) => {
        console.error(`Error fetching chats for user ${userId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  addMemberToChat(chatId: string, userId: string): Observable<void> {
    if (!chatId || !userId) {
      return throwError(() => new Error('Chat ID and user ID are required'));
    }

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    return from(
      updateDoc(chatRef, {
        members: arrayUnion(userId),
        updatedAt: serverTimestamp(),
      }),
    ).pipe(
      catchError((error) => {
        console.error(
          `Error adding member ${userId} to chat ${chatId}:`,
          error,
        );
        return throwError(() => error);
      }),
    );
  }

  removeMemberFromChat(chatId: string, userId: string): Observable<void> {
    if (!chatId || !userId) {
      return throwError(() => new Error('Chat ID and user ID are required'));
    }

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    return from(
      updateDoc(chatRef, {
        members: arrayRemove(userId),
        updatedAt: serverTimestamp(),
      }),
    ).pipe(
      catchError((error) => {
        console.error(
          `Error removing member ${userId} from chat ${chatId}:`,
          error,
        );
        return throwError(() => error);
      }),
    );
  }

  deleteChat(chatId: string): Observable<void> {
    if (!chatId) {
      return throwError(() => new Error('Chat ID is required'));
    }

    return this.deleteAllChatMessages(chatId).pipe(
      concatMap(() => {
        const chatRef = doc(this.firestore, `chats/${chatId}`);
        return from(deleteDoc(chatRef));
      }),
      catchError((error) => {
        console.error(`Error deleting chat ${chatId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  private deleteAllChatMessages(chatId: string): Observable<void> {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    return from(getDocs(messagesRef)).pipe(
      switchMap((snapshot) => {
        const deletions = snapshot.docs.map((doc) => deleteDoc(doc.ref));

        if (deletions.length === 0) {
          return of(undefined);
        }

        return from(Promise.all(deletions)).pipe(map(() => undefined));
      }),
    );
  }

  sendMessage(
    chatId: string,
    message: Omit<Message, 'id' | 'timestamp'>,
  ): Observable<Message> {
    if (!chatId || !message.content) {
      return throwError(
        () => new Error('Chat ID and message content are required'),
      );
    }

    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);

    const newMessage = {
      ...message,
      timestamp: serverTimestamp(),
    };

    return from(addDoc(messagesRef, newMessage)).pipe(
      switchMap((docRef) => {
        const chatRef = doc(this.firestore, `chats/${chatId}`);
        return from(
          updateDoc(chatRef, {
            lastMessage: newMessage,
            updatedAt: serverTimestamp(),
          }),
        ).pipe(
          map(() => {
            const completeMessage: Message = {
              id: docRef.id,
              ...message,
              timestamp: new Date(),
            };
            return completeMessage;
          }),
        );
      }),
      catchError((error) => {
        console.error(`Error sending message to chat ${chatId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  getChatMessages(chatId: string, messageLimit = 50): Observable<Message[]> {
    if (!chatId) {
      return of([]);
    }

    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(messageLimit),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((messages) => {
        return (messages as Message[]).sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
        );
      }),
      catchError((error) => {
        console.error(`Error fetching messages for chat ${chatId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  markMessageAsRead(
    chatId: string,
    messageId: string,
    userId: string,
  ): Observable<void> {
    if (!chatId || !messageId || !userId) {
      return throwError(
        () => new Error('Chat ID, message ID, and user ID are required'),
      );
    }

    const readByRef = doc(
      this.firestore,
      `chats/${chatId}/messages/${messageId}/readBy/${userId}`,
    );
    return from(
      setDoc(readByRef, {
        timestamp: serverTimestamp(),
      }),
    ).pipe(
      catchError((error) => {
        console.error(`Error marking message ${messageId} as read:`, error);
        return throwError(() => error);
      }),
    );
  }

  getUnreadMessageCount(chatId: string, userId: string): Observable<number> {
    if (!chatId || !userId) {
      return of(0);
    }

    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap((messages) => {
        if (messages.length === 0) {
          return of(0);
        }

        const readChecks = messages.map((message) => {
          const readByRef = doc(
            this.firestore,
            `chats/${chatId}/messages/${message['id']}/readBy/${userId}`,
          );
          return from(getDoc(readByRef)).pipe(
            map((snapshot) => !snapshot.exists()),
          );
        });

        return combineLatest(readChecks).pipe(
          map((results) => results.filter((isUnread) => isUnread).length),
        );
      }),
      catchError((error) => {
        console.error(`Error getting unread count for chat ${chatId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  listenForNewMessages(chatId: string): Observable<Message> {
    if (!chatId) {
      return throwError(() => new Error('Chat ID is required'));
    }

    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));

    return collectionData(q, { idField: 'id' }).pipe(
      map((messages) => {
        if (messages.length === 0) {
          throw new Error('No messages found');
        }
        return messages[0] as Message;
      }),
      catchError((error) => {
        console.error(
          `Error listening for new messages in chat ${chatId}:`,
          error,
        );
        return throwError(() => error);
      }),
    );
  }

  sendTypingIndicator(
    chatId: string,
    userId: string,
    isTyping: boolean,
  ): Observable<void> {
    if (!chatId || !userId) {
      return throwError(() => new Error('Chat ID and user ID are required'));
    }

    if (!this.typingUsers.has(chatId)) {
      this.typingUsers.set(chatId, new BehaviorSubject<TypingUser[]>([]));
    }

    const typingRef = doc(this.firestore, `chats/${chatId}/typing/${userId}`);

    if (isTyping) {
      return from(
        setDoc(typingRef, {
          timestamp: serverTimestamp(),
        }),
      ).pipe(
        catchError((error) => {
          console.error(
            `Error sending typing indicator for ${userId} in chat ${chatId}:`,
            error,
          );
          return throwError(() => error);
        }),
      );
    } else {
      return from(deleteDoc(typingRef)).pipe(
        catchError((error) => {
          console.error(
            `Error removing typing indicator for ${userId} in chat ${chatId}:`,
            error,
          );
          return throwError(() => error);
        }),
      );
    }
  }

  getTypingUsers(chatId: string): Observable<User[]> {
    if (!chatId) {
      return of([]);
    }

    const typingRef = collection(this.firestore, `chats/${chatId}/typing`);

    return collectionData(typingRef, { idField: 'userId' }).pipe(
      switchMap((typingDocs) => {
        if (typingDocs.length === 0) {
          return of([]);
        }

        const now = new Date();
        const validTypingUserIds = typingDocs
          .filter((doc) => {
            const timestamp = doc['timestamp']
              ? new Date(doc['timestamp'].seconds * 1000)
              : null;
            return timestamp && now.getTime() - timestamp.getTime() < 10000;
          })
          .map((doc) => doc['userId'] as string);

        if (validTypingUserIds.length === 0) {
          return of([]);
        }

        return this.userService.getUsersByIds(validTypingUserIds);
      }),
      catchError((error) => {
        console.error(`Error getting typing users for chat ${chatId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  getChatMembers(chatId: string): Observable<User[]> {
    return this.getChatById(chatId).pipe(
      switchMap((chat) => {
        if (!chat) {
          return of([]);
        }
        return this.userService.getUsersByIds(chat.members);
      }),
    );
  }

  updateChatName(chatId: string, name: string): Observable<void> {
    if (!chatId || !name) {
      return throwError(() => new Error('Chat ID and name are required'));
    }

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    return from(
      updateDoc(chatRef, {
        name,
        updatedAt: serverTimestamp(),
      }),
    ).pipe(
      catchError((error) => {
        console.error(`Error updating name for chat ${chatId}:`, error);
        return throwError(() => error);
      }),
    );
  }

  getChatsWithUnreadMessages(userId: string): Observable<Chat[]> {
    return this.getUserChats(userId).pipe(
      switchMap((chats) => {
        if (chats.length === 0) {
          return of([]);
        }

        const chatsWithUnreadCounts = chats.map((chat) => {
          return this.getUnreadMessageCount(chat.id, userId).pipe(
            map((count) => ({ chat, unreadCount: count })),
          );
        });

        return combineLatest(chatsWithUnreadCounts).pipe(
          map((results) =>
            results
              .filter((result) => result.unreadCount > 0)
              .map((result) => result.chat),
          ),
        );
      }),
    );
  }

  markAllMessagesAsRead(chatId: string, userId: string): Observable<void> {
    return this.getChatMessages(chatId).pipe(
      switchMap((messages) => {
        if (messages.length === 0) {
          return of(undefined);
        }

        const markPromises = messages.map((message) =>
          this.markMessageAsRead(chatId, message.id, userId),
        );

        return combineLatest(markPromises).pipe(map(() => undefined));
      }),
    );
  }
}
