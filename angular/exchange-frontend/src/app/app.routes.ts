import { Routes } from '@angular/router';
import { ShareListComponent } from './components/share-list/share-list.component';
import { BuyerListComponent } from './components/buyer-list/buyer-list.component';
import { DealListComponent } from './components/deal-list/deal-list.component';
import { CreateDealComponent } from './components/create-deal/create-deal.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'shares', pathMatch: 'full' },
  { path: 'shares', component: ShareListComponent },
  { path: 'buyers', component: BuyerListComponent },
  { path: 'deals', component: DealListComponent },
  { path: 'create-deal', component: CreateDealComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'shares' }
];
