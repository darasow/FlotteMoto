import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneListeComponent } from './panne-liste.component';

describe('PanneListeComponent', () => {
  let component: PanneListeComponent;
  let fixture: ComponentFixture<PanneListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanneListeComponent]
    });
    fixture = TestBed.createComponent(PanneListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
