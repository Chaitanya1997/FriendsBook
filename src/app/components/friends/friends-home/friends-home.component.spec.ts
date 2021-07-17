import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsHomeComponent } from './friends-home.component';

describe('FriendsHomeComponent', () => {
  let component: FriendsHomeComponent;
  let fixture: ComponentFixture<FriendsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
