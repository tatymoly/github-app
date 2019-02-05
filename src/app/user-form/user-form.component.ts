import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Router } from '@angular/router';

import { GithubService } from '../shared/services/github.service';

export interface UserData {
  name: string;
  language: string;
  default_branch: string;
  urlGit: string;
  description: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  firstName: string;
  lastName: string;
  email: string;
  idNumber: string;
  birthday: string;
  githubId: string;
  formValid: Boolean = false;
  showUserForm: Boolean = false;
  showRepositories: Boolean = false;

  userInfo = [];
  data;
  displayedColumns: string[] = [
    'name',
    'language',
    'default_branch',
    'urlGit',
    'description',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private githubService: GithubService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit() {
    this.createUserForm();
    this.checkActualUser();
  }

  // Check if cookie exist and shows data
  checkActualUser() {
    const data = this.getCookie('userInfo');
    if (data) {
      const parse = JSON.parse(data);
      this.firstName = parse[0];
      this.lastName = parse[1];
      this.email = parse[2];
      this.idNumber = parse[3];
      this.birthday = parse[4];
      this.githubId = parse[5];
      this.formValid = true;
      this.showRepositories = true;
    } else {
      this.formValid = false;
      this.showUserForm = true;
    }
  }

  // Creates User Form
  createUserForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      idNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(12),
        ],
      ],
      birthday: ['', [Validators.required]],
      githubId: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  setFormValues() {
    this.firstName = this.userForm.get('firstName').value;
    this.userInfo.push(this.firstName);
    this.lastName = this.userForm.get('lastName').value;
    this.userInfo.push(this.lastName);
    this.email = this.userForm.get('email').value;
    this.userInfo.push(this.email);
    this.idNumber = this.userForm.get('idNumber').value;
    this.userInfo.push(this.idNumber);
    this.birthday = this.userForm.get('birthday').value;
    this.userInfo.push(this.birthday);
    this.githubId = this.userForm.get('githubId').value;
    this.userInfo.push(this.githubId);
  }

  updateForm() {
    this.setFormValues();
    this.storeValues();
    this.formValid = true;
    this.showUserForm = false;
    this.showRepositories = true;
    this.userForm.reset();
  }

  clearForm() {
    this.userForm.reset();
  }

  addUser() {
    this.formValid = !this.formValid;
    this.showUserForm = !this.formValid;
  }

  deleteUser() {
    this.eraseCookie('userInfo');
    this.formValid = false;
    this.showUserForm = true;
    this.showRepositories = false;
  }

  showRepos(githubId) {
    this.githubService.searchUserRepositories(githubId).subscribe(res => {
      this.data = res;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // Filter
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Create Cookie
  setCookie(name, value, days) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  storeValues() {
    this.setCookie(
      'userInfo',
      JSON.stringify(this.userInfo),
      Date.UTC(2019, 8, 1)
    );
  }

  getCookie(name) {
    const nameEQ = name + '=';
    const cookie = document.cookie.split(';');
    for (let i = 0; i < cookie.length; i++) {
      let c = cookie[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
  }
}
