import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject, takeUntil } from "rxjs";
import { Chart, ChartConfiguration, ChartType, registerables } from "chart.js";
import {
  LucideAngularModule,
  Users,
  BookOpen,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
  Package,
  PenTool,
  Clock,
  Eye,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-angular";

import {
  AnalyticsService,
  DashboardStats,
} from "../../../services/analytics.service";

Chart.register(...registerables);

@Component({
  selector: "app-dashboard",
  imports: [CommonModule, LucideAngularModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("revenueChart", { static: false }) revenueChartRef!: ElementRef;
  @ViewChild("statusChart", { static: false }) statusChartRef!: ElementRef;
  @ViewChild("userGrowthChart", { static: false })
  userGrowthChartRef!: ElementRef;
  @ViewChild("paymentMethodChart", { static: false })
  paymentMethodChartRef!: ElementRef;

  dashboardStats: DashboardStats | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  private charts: Chart[] = [];

  // Lucide icons
  readonly Users = Users;
  readonly BookOpen = BookOpen;
  readonly ShoppingCart = ShoppingCart;
  readonly DollarSign = DollarSign;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly User = User;
  readonly Package = Package;
  readonly PenTool = PenTool;
  readonly Clock = Clock;
  readonly Eye = Eye;
  readonly BarChart3 = BarChart3;
  readonly PieChart = PieChart;
  readonly Activity = Activity;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // Charts will be initialized after data is loaded
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    // Destroy all charts
    this.charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
  }

  loadDashboardData() {
    this.loading = true;
    this.error = null;

    this.analyticsService
      .getDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dashboardStats = response.data;
          this.loading = false;

          // Initialize charts after data is loaded
          setTimeout(() => {
            this.initializeCharts();
          }, 100);
        },
        error: (error) => {
          console.error("Error loading dashboard stats:", error);
          this.error = "Failed to load dashboard statistics";
          this.loading = false;
        },
      });
  }

  private initializeCharts() {
    if (!this.dashboardStats) return;

    this.initRevenueChart();
    this.initStatusChart();
    this.initUserGrowthChart();
    this.initPaymentMethodChart();
  }

  private initRevenueChart() {
    if (!this.revenueChartRef?.nativeElement || !this.dashboardStats) return;

    const ctx = this.revenueChartRef.nativeElement;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const labels = this.dashboardStats.charts.monthlyRevenue.map(
      (item) => `${monthNames[item._id.month - 1]} ${item._id.year}`
    );
    const data = this.dashboardStats.charts.monthlyRevenue.map(
      (item) => item.revenue || 0
    );

    const config: ChartConfiguration = {
      type: "line" as ChartType,
      data: {
        labels,
        datasets: [
          {
            label: "Monthly Revenue",
            data,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        },
      },
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private initStatusChart() {
    if (!this.statusChartRef?.nativeElement || !this.dashboardStats) return;

    const ctx = this.statusChartRef.nativeElement;
    const labels = this.dashboardStats.charts.orderStatusDistribution.map(
      (item) => this.capitalizeFirst(item._id)
    );
    const data = this.dashboardStats.charts.orderStatusDistribution.map(
      (item) => item.count
    );

    const colors = [
      "rgba(255, 206, 84, 0.8)",
      "rgba(54, 162, 235, 0.8)",
      "rgba(255, 99, 132, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(153, 102, 255, 0.8)",
    ];

    const config: ChartConfiguration = {
      type: "doughnut" as ChartType,
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private initUserGrowthChart() {
    if (!this.userGrowthChartRef?.nativeElement || !this.dashboardStats) return;

    const ctx = this.userGrowthChartRef.nativeElement;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const labels = this.dashboardStats.charts.userGrowth.map(
      (item) => `${monthNames[item._id.month - 1]} ${item._id.year}`
    );
    const data = this.dashboardStats.charts.userGrowth.map(
      (item) => item.count
    );

    const config: ChartConfiguration = {
      type: "bar" as ChartType,
      data: {
        labels,
        datasets: [
          {
            label: "New Users",
            data,
            backgroundColor: "rgba(34, 197, 94, 0.8)",
            borderColor: "rgb(34, 197, 94)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private initPaymentMethodChart() {
    if (!this.paymentMethodChartRef?.nativeElement || !this.dashboardStats)
      return;

    const ctx = this.paymentMethodChartRef.nativeElement;
    const labels = this.dashboardStats.charts.paymentMethodDistribution.map(
      (item) => (item._id === "cash" ? "Cash on Delivery" : "Online Payment")
    );
    const data = this.dashboardStats.charts.paymentMethodDistribution.map(
      (item) => item.count
    );

    const colors = ["rgba(168, 85, 247, 0.8)", "rgba(236, 72, 153, 0.8)"];

    const config: ChartConfiguration = {
      type: "pie" as ChartType,
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace("-", " ");
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
