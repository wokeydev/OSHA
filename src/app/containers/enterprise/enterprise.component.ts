import { Component, OnInit } from '@angular/core';
import { AlertService, OshaService, DashboardService, EnterpriseService } from '../../_services';
import { dashboardItems } from '../../_dashboard';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  templateUrl: 'enterprise.component.html',
  styleUrls: ['./enterprise.component.css']
})
export class EnterpriseComponent implements OnInit {

  // Enterprise Totals
  public force_totals: any = []
  public force_children: any = null
  public child_org_id:String = ''
  public selected_total: String = ''
  public is_loading = false

  constructor(private alertService: AlertService, private oshaService: OshaService, 
              public dashboardService: DashboardService, public enterpriseService: EnterpriseService,
              private route:ActivatedRoute, private router:Router) {

    //=== Get child organziation id ===
    this.selected_total = this.enterpriseService.total_fields[0];
    route.queryParams.subscribe(params=>{
      if(params.hasOwnProperty('child'))
        this.child_org_id = params.child
      if(params.hasOwnProperty('field'))
        this.selected_total = params.field
    });
    //==================================
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false
    };
    
    this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
            this.router.navigated = false
            window.scrollTo(0, 0)
        }
    });
  }

  ngOnInit(): void {
    this.is_loading = true;
    this.enterpriseService.get_children_totals(this.child_org_id).subscribe( data=> {
      this.is_loading = false;
      if(data.totalSize == 1){
        this.force_totals = data.records[0]
        this.force_children = this.force_totals.Partners__r
        console.log(this.force_children)
      }
    },
    err=>{
      if(err == "Bad Request"){
        this.router.navigateByUrl('/dashboard')
        
      }
    });
  }

  doDashboard(){
  
  }
  remove__c(string){
    return string.trim().replace(/\__c/gi, "")
  }
  replace_space(string){
    return string.replace(/\_/gi, " ")
  }
  remove_total(string){
    return string.replace(/\Total_/gi, "")
  }
}
