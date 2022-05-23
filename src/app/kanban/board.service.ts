import { Injectable } from '@angular/core';

import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Board, Task } from './board.model';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  // creates new board

  async createBoard(data: Board) {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Hello', label: 'yellow' }],
    });
  }

  deleteBoard(boardId: string) {
    return this.db.collection('boards').doc(boardId).delete();
  }

  updateTask(boardId: string, tasks: Task[]) {
    return this.db.collection('boards').doc(boardId).update({ tasks });
  }

  removeTask(boardId: string, task: Task){
    return this.db.collection('boards').doc(boardId).update({
      tasks: firebase.firestore.FieldValue.arrayRemove(task)
    })
  }

  // Get All Board owned by current User

  getUserBoards(){
    return this.afAuth.authState.pipe(
      switchMap(user =>{
         if(user){
           return this.db.collection<Board>('boards', ref => 
             ref.where('uid', '==', user.uid).orderBy('priority')
           ).valueChanges({idField: 'id'})
         }else{
           return [];
         }
      })
    )
  }

  sortBoards(boards: Board[]){
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map(b => db.collection('board').doc(b.id));
    refs.forEach((ref, idx)=> batch.update(ref, {priority: idx}));
    batch.commit();
  }

} 
