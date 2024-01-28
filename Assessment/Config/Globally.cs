using Microsoft.Extensions.Options;
using System.Data;
using System.Net.Http.Headers;
using System.Net;
using System.Text;

namespace Assessment.Config
{
    public class Globally
    {
    }
    public interface IResult
    {
        public bool is_ok { get; set; }
        public int totalRow { get; set; }
        public string message { get; set; }
    }

    public class Result : IResult
    {
        public bool is_ok { get; set; }
        public int totalRow { get; set; }
        public string message { get; set; }
    }

    public class ClsGlobal
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
       // public IOptions<AppSettingsModel> Aps;
        public static string base_api, pim_base_api;
        //public AppSettingsModel aps;
        private string _token;

        //constructor
        //public ClsGlobal(IOptions<AppSettingsModel> AppSettings, IHttpContextAccessor httpContextAccessor)
        //{
        //    Aps = AppSettings;
        //    aps = Aps.Value;
        //    base_api = aps.base_api;
        //    pim_base_api = aps.pim_base_api;
        //    _httpContextAccessor = httpContextAccessor;
        //    _token = GetSessionValue<UserAuthModel>("UserAuth")?.access_token;
        //}

       
        public string FNH_PostHttpClient(bool needToken, string token, string bodyData, string url)
        {

            HttpClient client = new HttpClient();


            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            var contentData = new StringContent(bodyData, Encoding.UTF8, "application/json");

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            HttpResponseMessage response = client.PostAsync(url, contentData).Result;
            string JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;
        }

        public string FNH_PUTHttpClient(bool needToken, string token, string bodyData, string url)
        {
            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            var contentData = new StringContent(bodyData, Encoding.UTF8, "application/json");

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            HttpResponseMessage response = client.PutAsync(url, contentData).Result;
            string JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;
        }

        public string FNH_DeleteHttpClient(bool needToken, string token, string bodyData, string url)
        {
            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            _ = new StringContent(bodyData, Encoding.UTF8, "application/json");

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            url += bodyData;
            HttpResponseMessage response = client.DeleteAsync(url).Result;
            string JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;
        }
        public string FNH_DeleteHttpClient(bool needToken, string token, int param, string url)
        {

            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            url += param;
            HttpResponseMessage response = client.DeleteAsync(url).Result;
            string JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;
        }
        public string FNH_GetHttpClient(bool needToken, string token, List<string> param, string url)
        {
            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            url = param.Count > 0 ? url + String.Join("&", param) : url;
            HttpResponseMessage response = client.GetAsync(url).Result;
            string JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;


        }
        public string FNH_GetHttpClientByID(bool needToken, string token, string param, string url)
        {
            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            url += param;
            HttpResponseMessage response = client.GetAsync(url).Result;
            string JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;


        }
        public string FNH_GetHttpClientByID(bool needToken, string token, int param, string url)
        {

            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            url += param;
            HttpResponseMessage response = client.GetAsync(url).Result;
            string JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;
        }
        public string FNH_GetHttpClientWithJson(bool needToken, string token, List<string> param, string bodyData, string url)
        {
            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");

            url = param.Count > 0 ? url + String.Join("&", param) : "";
            Uri Uribase_api = new Uri(base_api);
            Uri myUri = new Uri(Uribase_api, url);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = myUri,
                Content = new StringContent(bodyData, Encoding.UTF8, "application/json"),
            };

            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            var response = client.SendAsync(request).Result;
            var responseModel = response.Content.ReadAsStringAsync().Result;
            return responseModel;
        }
        public string FNH_PostHttpClientFormData(bool needToken, string token, MultipartFormDataContent bodyData)
        {

            HttpClient client = new HttpClient();
            using var request = new HttpRequestMessage(HttpMethod.Post, "file");
            request.Content = bodyData;

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            HttpResponseMessage response = client.SendAsync(request).Result;
            var JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;
        }

        public static byte[] FNH_GetHttpClientFile(bool needToken, string token, List<string> param, string url, ref string ctType)
        {
            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");

            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);


            var file = client.GetAsync(url + String.Join("&", param)).Result;
            ctType = file.Content.Headers.ContentType.MediaType;
            return file.Content.ReadAsByteArrayAsync().Result;
        }
        public string FNH_PostHttpClient2(bool needToken, string token, string bodyData, string url)
        {

            HttpClient client = new HttpClient();


            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            var contentData = new StringContent(bodyData, Encoding.UTF8, "application/json");
            client.BaseAddress = new Uri(base_api);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            HttpResponseMessage response = client.PostAsync(url, contentData).Result;
            response.Headers.TransferEncodingChunked = true;
            string JsonData = response.Content.ReadAsStringAsync().Result;
            return JsonData;
        }
        public string PIM_GetHttpClientWithJson(bool needToken, string token, string bodyData, string url)
        {
            HttpClient client = new HttpClient();

            var contentType = new MediaTypeWithQualityHeaderValue("application/json");

            //url = param.Count > 0 ? url + String.Join("&", param) : "";
            Uri Uribase_api = new Uri(pim_base_api);
            Uri myUri = new Uri(Uribase_api, url);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = myUri,
                Content = new StringContent(bodyData, Encoding.UTF8, "application/json"),
            };

            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(contentType);

            if (needToken)
                client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", token);

            var response = client.SendAsync(request).Result;
            var responseModel = response.Content.ReadAsStringAsync().Result;
            return responseModel;
        }
        public bool FNH_CheckFTPDirectoryExist(string strPath, string userName, string password, out string message)
        {
            bool resp = true;
            message = "";

            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(new Uri(strPath));
                request.Credentials = new NetworkCredential(userName, password);
                request.Method = WebRequestMethods.Ftp.ListDirectory;

                FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                resp = true;
            }
            catch (WebException ex)
            {
                FtpWebResponse response = (FtpWebResponse)ex.Response;
                if (response.StatusCode == FtpStatusCode.ActionNotTakenFileUnavailable)
                    resp = false;
            }
            return resp;
        }

        public bool FNH_CreateFTPDirectory(string strPath, string userName, string password, out string message)
        {
            bool resp = true;
            message = "";
            try
            {
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create(new Uri(strPath));
                request.Method = WebRequestMethods.Ftp.MakeDirectory;
                request.Credentials = new NetworkCredential(userName, password);
                request.KeepAlive = false;
                using var respFtp = (FtpWebResponse)request.GetResponse();
                respFtp.Close();
            }
            catch (WebException ex)
            {
                resp = false;
                message = (ex.Response as FtpWebResponse).StatusCode.ToString();
            }
            return resp;
        }

       
        

        public bool ExportDatatoExcel(DataSet ds, string strLocalPath, string SheetName, out string message)
        {
            bool resp = true;
            message = "";
            try
            {
                //using XLWorkbook wb = new XLWorkbook();
                //wb.Worksheets.Add(ds);
                //wb.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
                //wb.Style.Font.Bold = true;
                //wb.Worksheets.Worksheet(1).Name = SheetName;

                using var stream = new MemoryStream();
                //wb.SaveAs(strLocalPath);
            }
            catch (Exception ex)
            {
                resp = false;
                message = ex.Message.ToString();
            }
            return resp;
        }

        //public T GetSessionValue<T>(string key)
        //{
        //    var sessionValue = _httpContextAccessor.HttpContext?.Session?.GetString(key);
        //    if (sessionValue != null)
        //    {
        //        //return JsonConvert.DeserializeObject<T>(sessionValue);
        //    }
        //    else
        //    {
        //        return default;
        //    }
        //}

        public static bool IsNullOrEmpty<T>(T value)
        {
            if (value == null)
            {
                return true;
            }

            if (typeof(T) == typeof(string))
            {
                string stringValue = value as string;
                return string.IsNullOrEmpty(stringValue);
            }

            if (typeof(T) == typeof(int))
            {
                int intValue = Convert.ToInt32(value);
                return intValue == 0;
            }


            return false; // For unsupported types, consider them as not null or empty
        }
    }
}
