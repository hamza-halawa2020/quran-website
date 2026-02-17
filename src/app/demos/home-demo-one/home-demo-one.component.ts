import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { MainSlider } from '../../common/main-slider/main-slider.component';
import { HowItWorksComponent } from '../../common/how-it-works/how-it-works.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { ServicesSectionComponent } from './components/services-section/services-section.component';
import { StatsSectionComponent } from './components/stats-section/stats-section.component';
import { WorkSamplesSectionComponent } from './components/work-samples-section/work-samples-section.component';
import { TeamSectionComponent } from './components/team-section/team-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { LatestCoursesSectionComponent } from './components/latest-courses-section/latest-courses-section.component';
import { LatestPostsSectionComponent } from './components/latest-posts-section/latest-posts-section.component';
import { CtaSectionComponent } from './components/cta-section/cta-section.component';
import { PartnersSectionComponent } from './components/partners-section/partners-section.component';
import { PaymentMethodsComponent } from '../../common/payment-methods/payment-methods.component';
import { HomeService, HomeData } from './home.service';

@Component({
    selector: 'app-home-demo-one',
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule,
        CarouselModule,
        MainSlider,
        HowItWorksComponent,
        AboutSectionComponent,
        ServicesSectionComponent,
        StatsSectionComponent,
        WorkSamplesSectionComponent,
        TeamSectionComponent,
        TestimonialsSectionComponent,
        LatestCoursesSectionComponent,
        LatestPostsSectionComponent,
        CtaSectionComponent,
        PartnersSectionComponent,
        PaymentMethodsComponent,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './home-demo-one.component.html',
    styleUrl: './home-demo-one.component.scss',
})
export class HomeDemoOneComponent implements OnInit {

    homeData: HomeData | null = null;
    isLoading = true;
    error: string | null = null;

    defaultStats = {
        completedStudies: 250,
        satisfiedClients: 800,
        yearsExperience: 20,
        successPartners: 75
    };

    constructor(
        public translate: TranslateService,
        private homeService: HomeService
    ) { }

    ngOnInit(): void {
        this.loadHomeData();
    }

    loadHomeData(): void {
        this.isLoading = true;
        this.error = null;

        this.homeService.getHomeData().subscribe({
            next: (data) => {
                if (!this.homeData) {
                    this.homeData = {
                        stats: this.defaultStats,
                        latestWorkSamples: [],
                        teamMembers: [],
                        testimonials: [],
                        latestPosts: [],
                        latestCourses: [],
                        partners: []
                    };
                }

                if (data.stats) {
                    this.homeData.stats = data.stats;
                }
                if (data.testimonials && data.testimonials.length > 0) {
                    this.homeData.testimonials = data.testimonials;
                }
                if (data.partners && data.partners.length > 0) {
                    this.homeData.partners = data.partners;
                }
                if (data.latestWorkSamples && data.latestWorkSamples.length > 0) {
                    this.homeData.latestWorkSamples = data.latestWorkSamples;
                }
                if (data.teamMembers && data.teamMembers.length > 0) {
                    this.homeData.teamMembers = data.teamMembers;
                }
                if (data.latestPosts && data.latestPosts.length > 0) {
                    this.homeData.latestPosts = data.latestPosts;
                }
                if (data.latestCourses && data.latestCourses.length > 0) {
                    this.homeData.latestCourses = data.latestCourses;
                }

                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading home data:', error);
                if (!this.homeData) {
                    this.homeData = {
                        stats: this.defaultStats,
                        latestWorkSamples: [],
                        teamMembers: [],
                        testimonials: [],
                        latestPosts: [],
                        latestCourses: [],
                        partners: []
                    };
                }
                this.isLoading = false;
            }
        });
    }

    retryLoadData(): void {
        this.loadHomeData();
    }
}
