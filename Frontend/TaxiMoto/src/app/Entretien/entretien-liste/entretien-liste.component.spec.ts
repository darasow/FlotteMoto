import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienListeComponent } from './entretien-liste.component';

describe('EntretienListeComponent', () => {
  let component: EntretienListeComponent;
  let fixture: ComponentFixture<EntretienListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntretienListeComponent]
    });
    fixture = TestBed.createComponent(EntretienListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
