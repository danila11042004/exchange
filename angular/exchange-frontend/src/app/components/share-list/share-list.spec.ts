import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareList } from './share-list';

describe('ShareList', () => {
  let component: ShareList;
  let fixture: ComponentFixture<ShareList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
