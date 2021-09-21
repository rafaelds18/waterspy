import { RoleService } from './../../shared/services/api-consumer/role.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/api-consumer/user.service';
import { Role } from 'src/app/shared/models/role';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  public usersList: Array<User>;
  public usersForm: FormGroup;
  public roles: Array<Role>;
  public roleSelected: Role;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private roleService: RoleService) { }

  ngOnInit(): void {
    this.usersForm = this.fb.group({
      users: this.fb.array([])
    });
    this.getRoles();
    this.getUsers();
  }

  get users() {
    return this.usersForm.controls["users"] as FormArray;
  }

  public getRoles() {
    this.roleService.getAll().subscribe(res => {
      this.roles = res;
    });
  }

  public getUsers(){
    this.userService.getAllWithDetails().subscribe(res => {
      this.usersList = res;
      for (let user of this.usersList) {
        this.users.push(
          this.setFormGroup(user)
        );
      }
    })
  }

  public setFormGroup(user: User){
    let roleDescription = user.roles ? user.roles[0].description.toUpperCase() : '';
    return new FormGroup({
      id: new FormControl(user.id),
      firstName: new FormControl(user.firstName, Validators.required),
      lastName: new FormControl(user.lastName, Validators.required),
      email: new FormControl(user.email, Validators.required),
      emailConfirmed: new FormControl(user.emailConfirmed, Validators.required),
      roles: new FormControl(this.translateService.instant('ROLES.' + roleDescription), Validators.required)
    });
  }

}
