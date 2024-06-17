import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListeComponent } from './user-liste.component';

describe('UserListeComponent', () => {
  let component: UserListeComponent;
  let fixture: ComponentFixture<UserListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListeComponent]
    });
    fixture = TestBed.createComponent(UserListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
