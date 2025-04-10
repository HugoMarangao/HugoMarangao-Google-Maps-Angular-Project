import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LovedModalComponent } from './loved-modal.component';

describe('LovedModalComponent', () => {
  let component: LovedModalComponent;
  let fixture: ComponentFixture<LovedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LovedModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LovedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
