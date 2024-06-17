// role.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, RoleService } from './role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  roleForm: FormGroup;
  isEditMode: boolean = false;
  showModal: boolean = false;
  selectedRole: Role | null = null;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      authorization_level: ['', [Validators.required, Validators.min(1)]],
      status: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles(this.currentPage).subscribe(response => {
      this.roles = response.roles;
      this.totalPages = response.totalPages;
    });
  }

  openModal(): void {
    this.isEditMode = false;
    this.selectedRole = null;
    this.roleForm.reset({ status: 1 });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  editRole(role: Role): void {
    this.isEditMode = true;
    this.selectedRole = role;
    this.roleForm.setValue({
      name: role.name,
      authorization_level: role.authorization_level,
      status: role.status
    });
    this.showModal = true;
  }

  deleteRole(id: number): void {
    this.roleService.deleteRole(id).subscribe(() => {
      this.roles = this.roles.filter(role => role.id !== id);
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const roleData = this.roleForm.value;

    if (this.isEditMode && this.selectedRole) {
      const updatedRole = { ...this.selectedRole, ...roleData };
      this.roleService.updateRole(updatedRole).subscribe(role => {
        const index = this.roles.findIndex(r => r.id === role.id);
        if (index !== -1) {
          this.roles[index] = role;
        }
        this.closeModal();
      });
    } else {
      this.roleService.createRole(roleData).subscribe(role => {
        this.roles.push(role);
        this.closeModal();
      });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRoles();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRoles();
    }
  }

  get formControls() {
    return this.roleForm.controls;
  }
}
