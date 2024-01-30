using Assessment.Data.DataAccess;
using Assessment.Data.dto;
using Assessment.Models;
using System.Xml.Linq;

namespace Assessment.Data.Repository
{
    public class EmployeeRepo
    {
        private readonly IsqlDataAccess _dataAccess;
        private readonly IConfiguration _configuration;
        public EmployeeRepo(IsqlDataAccess db, IConfiguration configuration)
        {
            _dataAccess = db;
            _configuration = configuration;
        }
        public string GetLastIDEmployee(string prefix)
        {
            var data = GetLastEmployeeID(prefix).Result.FirstOrDefault();
            return data;
        }
        private async Task<IEnumerable<string>> GetLastEmployeeID(string prefix)
        {
            string query = @"select max(ID) as ID from ms_employee  where ID like (@prefix)";
            var param = new Dictionary<string, object> {
                    { "prefix", prefix+"%" }
                    };
            return await _dataAccess.GetData<string, dynamic>(query, param);
        }

        public async Task<bool> SaveEmployee(ParamSaveEmployee data)
        {
            bool result = false;
            try
            {
                string query = string.Empty;
                string empID = string.Empty;
                var prefix = DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString("00");
                string tes = DateTime.Now.Month.ToString("00");
                var getLastID = GetLastIDEmployee(prefix);
                if(getLastID == null)
                {
                    empID = prefix + "00001";
                }
                else
                {
                    var maxid = int.Parse(getLastID.Substring(getLastID.Length-1))+1;
                    empID = prefix + maxid.ToString("D5");
                }

                var param = new Dictionary<string, object> {
                    {"id",empID },
                    { "name", data.name },
                    { "birthdate", data.birth_date },
                    { "sallary", data.sallary },
                    { "address", data.address },
                    { "nik" ,data.nik },
                    {"createddate", DateTime.Now },
                    {"updatedate", DateTime.Now }
                    };
                query = @"insert into ms_employee (ID,name,birth_date, address, sallary, nik, entry_date, update_date) 
                                values (@id,@name,@birthdate,@address,@sallary,@nik,@createddate,@updatedate)";
                await _dataAccess.SaveData(query, param);
                result = true;

            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        public async Task<bool> EditEmployee(ParamUpdateEmployee data)
        {
            bool result = false;
            try
            {
                string query = string.Empty;
                var param = new Dictionary<string, object> {
                    {"id", data.id },
                    { "name", data.name },
                    { "birthdate", data.birth_date },
                    { "sallary", data.sallary },
                    { "address", data.address },
                    {"updatedate", DateTime.Now }
                    };
                query = @"update  ms_employee set name=@name,birth_date=@birthdate, address=@address, sallary=@sallary, update_date=@updatedate where ID=@id";
                await _dataAccess.SaveData(query, param);
                result = true;

            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }
        public List<msemployee> GetListEmployee(string name,long id)
        {
            var data = GetListEmployees(name,id).Result.ToList();
            return data;
        }
        private async Task<IEnumerable<msemployee>> GetListEmployees(string name , long id)
        {
            string query = @"select * from ms_employee";

            if (!string.IsNullOrEmpty(name))
            {
                query += " where name like (@emplooyename)";
            }
            if (id>0)
            {
                query += " where id=@id";
            }
            var param = new Dictionary<string, object> {
                    { "emplooyename", "%"+name+"%" },
                    { "id", id }
                    };
            return await _dataAccess.GetData<msemployee, dynamic>(query, param);
        }
        public string GetNIKEmployee(string nik)
        {
            var data = GetNIK(nik).Result.FirstOrDefault();
            return data;
        }
        private async Task<IEnumerable<string>> GetNIK(string nik)
        {
            string query = @"select nik from ms_employee  where nik=@NIK";
            var param = new Dictionary<string, object> {
                    { "NIK", nik }
                    };
            return await _dataAccess.GetData<string, dynamic>(query, param);
        }
        public List<ParamRespEmployeeList> GetListEmployeesforGrid(ParamSearchEmployee filter)
        {
            var data = GetListEmployeesGrid(filter).Result.ToList();
            return data;
        }
        private async Task<IEnumerable<ParamRespEmployeeList>> GetListEmployeesGrid(ParamSearchEmployee filter)
        {
            string query = @"select * from(select ROW_NUMBER() OVER (ORDER BY id) AS RowNum,
                                count(id) OVER() as totalRecord,* from ms_employee";
            string orderby =  (string.IsNullOrEmpty(filter.orderBy) ? " order by id asc" : (" order by " + filter.orderBy + " "+ filter.sortBy));
            if (!string.IsNullOrEmpty(filter.name))
            {
                query += " where name like (@emplooyename)";
            }
            if (filter.id > 0)
            {
                query += " where id=@id";
            }
            
            query += @")temp
                        where temp.RowNum >=@offset 
	                    AND RowNum < @offset + @limit ";
            query += orderby;
            var param = new Dictionary<string, object> {
                    { "emplooyename", "%"+filter.name+"%" },
                    { "id", filter.id },
                    { "sortby", filter.sortBy},
                    { "orderby", filter.orderBy },
                    { "offset", filter.page-1},
                    { "limit", filter.size}
                    };
            return await _dataAccess.GetData<ParamRespEmployeeList, dynamic>(query, param);
        }

        public async Task<bool> DeleteEmployee(long id)
        {
            bool result = false;
            try
            {
                string query = string.Empty;
                var param = new Dictionary<string, object> {
                    {"empid", id }
                    };
                query = @"delete from  ms_employee where ID=@empid";
                await _dataAccess.SaveData(query, param);
                result = true;

            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }
    }
}
