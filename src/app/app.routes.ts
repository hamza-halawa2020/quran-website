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
        path: 'services',
        loadComponent: () => import('./pages/services-page/services-list/services-list.component').then(m => m.ServicesListComponent)
    },
    {
        path: 'services/:id',
        loadComponent: () => import('./pages/services-page/service-details/service-details.component').then(m => m.ServiceDetailsComponent)
    },

    {
        path: 'posts',
        loadComponent: () => import('./pages/posts-page/posts-list/posts-list.component').then(m => m.PostsListComponent)
    },
    {
        path: 'posts/:id',
        loadComponent: () => import('./pages/posts-page/post-details/post-details.component').then(m => m.PostDetailsComponent)
    },

    {
        path: 'faqs',
        loadComponent: () => import('./pages/faqs-page/faqs-page.component').then(m => m.FaqsPageComponent)
    },

    {
        path: 'testimonials',
        loadComponent: () => import('./pages/reviews-page/reviews-list/reviews-list.component').then(m => m.ReviewsListComponent)
    },


    { path: '**', component: ErrorPageComponent },
];