import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoComponent } from './moto-liste.component';

describe('MotoComponent', () => {
  let component: MotoComponent;
  let fixture: ComponentFixture<MotoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotoComponent]
    });
    fixture = TestBed.createComponent(MotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
