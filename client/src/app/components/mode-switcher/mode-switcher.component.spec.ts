import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeSwitcherComponent } from './mode-switcher.component';

describe('ModeSwitcherComponent', () => {
  let component: ModeSwitcherComponent;
  let fixture: ComponentFixture<ModeSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeSwitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
