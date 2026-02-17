import { Routes } from '@angular/router';
import { HomeDemoOneComponent } from './demos/home-demo-one/home-demo-one.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';
import { TermsConditionsPageComponent } from './pages/terms-conditions-page/terms-conditions-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';


export const routes: Routes = [
    { path: '', component: HomeDemoOneComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'terms-conditions', component: TermsConditionsPageComponent },
    { path: 'contacts', component: ContactPageComponent },


    {
        path: 'posts',
        loadComponent: () => import('./pages/posts-page/posts-list/posts-list.component').then(m => m.PostsListComponent)
    },
    {
        path: 'posts/:id',
        loadComponent: () => import('./pages/posts-page/post-details/post-details.component').then(m => m.PostDetailsComponent)
    },

    {
        path: 'courses',
        loadComponent: () => import('./pages/courses-page/courses-list/courses-list.component').then(m => m.CoursesListComponent)
    },
    {
        path: 'courses/:id',
        loadComponent: () => import('./pages/courses-page/course-details/course-details.component').then(m => m.CourseDetailsComponent)
    },

    {
        path: 'testimonials',
        loadComponent: () => import('./pages/reviews-page/reviews-list/reviews-list.component').then(m => m.ReviewsListComponent)
    },


    { path: '**', component: ErrorPageComponent },
];