import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Contact } from './interface/contact';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'loudinsight-test';
  contacts: Contact[] = [];
  loginForm: FormGroup = this.fb.group({
    searchField: this.fb.control('', Validators.required),
  });
  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    if (!this.getFromStorage()) {
      this.contacts = this.newData();
    } else {
      this.contacts = this.getFromStorage();
    }

    this.loginForm.valueChanges.subscribe({
      next: (val) => {
        if (val.searchField && val.searchField != '') {
          this.contacts = this.fuzzSearch(val.searchField, this.newData());
        } else {
          this.contacts = this.newData();
        }
      },
      error: (err) => err
    })
  }

  fuzzSearch(text: string, contacts: Contact[]) {
    const textSplit = text.toLowerCase().split(' ');
    return contacts.filter((item) => {
      return textSplit.every((el) => {
        return item.name.toLowerCase().indexOf(el) > -1;
      });
    });
  }

  newData() {
    const data: Contact[] = [
      {
        icon: 'fab fa-whatsapp fa-1x',
        name: 'Whatsapp Business Iceland'
      },
      {
        icon: 'far fa-envelope fa-1x',
        name: '(test) development California'
      },
      {
        icon: 'fab fa-whatsapp fa-1x',
        name: 'Whatsapp business'
      },
      {
        icon: 'fas fa-phone-alt fa-1x',
        name: 'Call center'
      }, {
        icon: 'fas fa-phone-alt fa-1x',
        name: 'Team@trengo.com'
      }
    ];
    return data;
  }

  remove(name: string) {
    this.contacts = this.contacts.filter((v) => v.name != name)
  }

  cancel() {
    this.contacts = this.getFromStorage() ? this.getFromStorage() : this.newData();
  }

  save() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts, null, ' '));
    return alert('Changes has been saved to localStorage');
  }

  getFromStorage() {
    if (localStorage.getItem('contacts')) {
      return JSON.parse(localStorage.getItem('contacts')!);
    } else {
      return null;
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

}
