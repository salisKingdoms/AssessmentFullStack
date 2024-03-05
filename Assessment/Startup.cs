using Assessment.Config;
using Assessment.Data.DataAccess;
using Assessment.Data.Repository;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;

namespace Assessment
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddHttpContextAccessor();
            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            //var appSettings = new AppSettingsModel();
            //Configuration.GetSection("ApplicationSettings").Bind(appSettings);
            //services.Configure<AppSettingsModel>(options =>
            //{
            //    options.client_secret = appSettings.client_secret;
            //    options.client_id = appSettings.client_id;
            //    options.client_secret = appSettings.client_secret;
            //    options.base_api = appSettings.base_api;
            //    options.pim_base_api = appSettings.pim_base_api;
            //    options.session_timeout = appSettings.session_timeout;
            //    options.aws_config = appSettings.aws_config;
            //});
            //services.Configure<AppSettingsModel>(Configuration.GetSection("ApplicationSettings"));
            //services.AddSession(o =>
            //{
            //    o.IdleTimeout = TimeSpan.FromSeconds(Configuration.GetValue<double>("ApplicationSettings:session_timeout"));
            //});
            //services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
            services.AddMvc().AddControllersAsServices();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            

            services.Configure<FormOptions>(options =>
            {
                options.ValueLengthLimit = int.MaxValue;
                options.MultipartBodyLengthLimit = int.MaxValue; // if don't set default value is: 128 MB
                options.MultipartHeadersLengthLimit = int.MaxValue;
            });
            //services.AddScoped<ClsGlobal>();
            services.AddScoped<IsqlDataAccess, sqlDataAccess>();
            services.AddScoped<InvoiceRepo, InvoiceRepo>();
            services.AddScoped<EmployeeRepo, EmployeeRepo>();
            services.AddScoped<CreditCardRepo, CreditCardRepo>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            //app.UseSession();
            //var cookiePolicyOptions = new CookiePolicyOptions
            //{
            //    MinimumSameSitePolicy = SameSiteMode.Strict,
            //};
            //app.UseCookiePolicy(cookiePolicyOptions);
            //added by leonagata holianti on 28 february 2023 AR2022-000735_SPRINT30_1204037939451573
            //untuk prevent clickjacking
            //app.Use(async (context, next) =>
            //{
            //    context.Response.Headers.Add("X-Frame-Options", "DENY");
            //    await next();
            //});


            //added by leonagata holianti on 28 february 2023 AR2022 - 000735_SPRINT30_1204037939451574
            //untuk prevent HTTP TRACE
            //app.Use(async (context, next) =>
            //{
            //    if (context.Request.Method == "OPTIONS")
            //    {
            //        context.Response.StatusCode = 405;
            //        return;
            //    }
            //    await next.Invoke();
            //});


            app.UseAuthentication();
            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                                  name: "default",
                                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });


            //app.Use(async (context, next) =>
            //{
            //    context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null; // unlimited I guess
            //    await next.Invoke();
            //});
        }



    }
}
