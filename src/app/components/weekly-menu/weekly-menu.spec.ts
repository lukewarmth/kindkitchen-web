import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyMenu } from './weekly-menu';

describe('WeeklyMenu', () => {
  let component: WeeklyMenu;
  let fixture: ComponentFixture<WeeklyMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
