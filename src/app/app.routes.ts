import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommunityComponent } from './community/community.component';
import { CommunityPageComponent } from './community-page/community-page.component';
import { ContentModerationComponent } from './content-moderation/content-moderation.component';
import { MessageComponent } from './message/message.component';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { AdminGuard } from './admin.guard';

export const routes: Routes = [
    {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'admin',component:AdminComponent,canActivate:[AdminGuard]},
  {path:'register',component:RegisterComponent},
  {path:'community',component:CommunityComponent},
  {path:'community_page/:id',component:CommunityPageComponent},
  {path:'content',component:ContentModerationComponent},
  {path:'content/:id',component:ContentModerationComponent},
  {path:'message',component:MessageComponent},
  {path:'update',component:UpdateInfoComponent},
  {path:'user',component:UserManagementComponent}
];
