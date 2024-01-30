using Assessment.Config;
using Assessment.Data.dto;
using Assessment.Data.Repository;
using Assessment.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Assessment.Data.dto;

namespace Assessment.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly EmployeeRepo _empRepo;
        public EmployeeController(EmployeeRepo repo)
        {
            _empRepo = repo;
        }
        public IActionResult Employees()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SubmitEmployee(ParamSaveEmployee model)
        {
            RespSaveInvoice result = new RespSaveInvoice();
            try
            {

                if (model.birth_date != null && DateTime.Now.Year - model.birth_date.Year <= 15)
                {
                    result.is_ok = false;
                    result.messageUI = "age must be more than 15 years old";
                    return Json(result);
                }

                if (!string.IsNullOrEmpty(model.nik))
                {
                    var sameNIK = _empRepo.GetNIKEmployee(model.nik);
                    if (!string.IsNullOrEmpty(sameNIK))
                    {
                        result.is_ok = false;
                        result.messageUI = "nik already registered, please type other nik";
                        return Json(result);
                    }
                }

                if (!string.IsNullOrEmpty(model.name) && model.name.Length > 30)
                {
                    result.is_ok = false;
                    result.messageUI = "length name cannot more than 30, please type other name";
                    return Json(result);
                }

                if (!string.IsNullOrEmpty(model.address) && model.address.Length > 200)
                {
                    result.is_ok = false;
                    result.messageUI = "length address cannot more than 200, please type other address";
                    return Json(result);
                }

                var save = _empRepo.SaveEmployee(model);
                result.is_ok = true;

            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.messageUI = "Submit Failed";
                result.messageConsole = ex.Message;
            }
            return Json(result);
        }

        [HttpPut]
        public JsonResult EditEmployee(ParamUpdateEmployee model)
        {
            RespSaveInvoice result = new RespSaveInvoice();
            try
            {

                if (model.birth_date != null && DateTime.Now.Year - model.birth_date.Year <= 15)
                {
                    result.is_ok = false;
                    result.messageUI = "age must be more than 15 years old";
                    return Json(result);
                }


                if (!string.IsNullOrEmpty(model.name) && model.name.Length > 30)
                {
                    result.is_ok = false;
                    result.messageUI = "length name cannot more than 30, please type other name";
                    return Json(result);
                }

                if (!string.IsNullOrEmpty(model.address) && model.address.Length > 200)
                {
                    result.is_ok = false;
                    result.messageUI = "length address cannot more than 200, please type other address";
                    return Json(result);
                }

                var save = _empRepo.EditEmployee(model);
                result.is_ok = true;

            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.messageUI = "Edit Failed";
                result.messageConsole = ex.Message;
            }
            return Json(result);
        }

        [HttpGet]
        public string GetEmployeeById(long id)
        {
            RespEmployee result = new RespEmployee();
            try
            {
                var emp = _empRepo.GetListEmployee(string.Empty, id).FirstOrDefault();
                if (emp.ID == 0)
                {
                    result.message = "employee not found";
                    result.is_ok = false;
                    return JsonConvert.SerializeObject(result);
                }

                result.ID = emp.ID;
                result.name = emp.name;
                result.birth_date = emp.birth_date;
                result.nik = emp.nik;
                result.sallary = emp.sallary;
                result.address = emp.address;
                result.message = "success";
                result.is_ok = true;

            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.message = "Edit Failed";

            }
            return JsonConvert.SerializeObject(result);
        }

        [HttpDelete]
        public string DeleteEmployee(long id)
        {
            RespDeleteInvoice result = new RespDeleteInvoice();
            try
            {
                var deleted = _empRepo.DeleteEmployee(id);
                result.is_ok = true;
                result.message = "success";
            }
            catch (Exception ex)
            {
                result.is_ok = true;
                result.message = ex.Message;
            }
            return JsonConvert.SerializeObject(result);
        }

        [HttpPost]
        public string GetEmployeeList(GridConfigModel gridData)
        {
            GridView modelJSON = new GridView();
            RespEmployeeList result = new RespEmployeeList();
            try
            {
                ParamGridSearch payload = new ParamGridSearch();
                ParamSearchEmployee filter = new ParamSearchEmployee();
                List<string> param = new List<string>();

                 if(gridData.iDisplayLength>0)
                    filter.size = gridData.iDisplayLength;
                if (gridData.iDisplayLength > 0)
                    filter.page = (Convert.ToInt32(gridData.iDisplayStart) == 0 ? 1 : (Convert.ToInt32(gridData.iDisplayStart) / gridData.iDisplayLength) + 1);
                if (sortEmployeeList(gridData.iSortCol) != "")
                {
                    filter.orderBy = sortEmployeeList(gridData.iSortCol);
                    filter.sortBy = gridData.sSortDir;
                }

                if (!string.IsNullOrEmpty(gridData.sSearch))
                {
                    filter.name = gridData.sSearch;
                }

                var getList = _empRepo.GetListEmployeesforGrid(filter);
                result.data = getList;
                result.is_ok = true;
                result.totalRow = getList.Count();
                if (result.is_ok)
                {
                   
                    modelJSON.draw = gridData.sEcho;
                    modelJSON.recordsFiltered = result.totalRow;
                    modelJSON.recordsTotal = result.totalRow;
                    modelJSON.data = result.data;
                    modelJSON.message = result.message;
                    modelJSON.statusCode = result.is_ok;
                }
                else
                {
                    modelJSON.message = result.message;
                    modelJSON.statusCode = result.is_ok;
                }
            }
            catch (Exception ex)
            {
                string message = ex.Message;
            }
            return JsonConvert.SerializeObject(modelJSON);
        }

        public static string sortEmployeeList(int index)
        {
            string value = string.Empty;
            switch (index)
            {
                case 1:
                    value = "name";
                    break;
                case 2:
                    value = "birth_date";
                    break;
                case 3:
                    value = "sallary";
                    break;
                case 4:
                    value = "nik";
                    break;


            }
            return value;
        }
        [HttpGet]
        public string GetListEmployee(string name)
        {
            RespEmployee result = new RespEmployee();
            try
            {
                //var emp = _empRepo.GetListEmployee(string.Empty, id).FirstOrDefault();
                //if (emp.ID == 0)
                //{
                //    result.message = "employee not found";
                //    result.is_ok = false;
                //    return JsonConvert.SerializeObject(result);
                //}

                //result.ID = emp.ID;
                //result.name = emp.name;
                //result.birth_date = emp.birth_date;
                //result.nik = emp.nik;
                //result.sallary = emp.sallary;
                //result.address = emp.address;
                //result.message = "success";
                //result.is_ok = true;

            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.message = "Edit Failed";

            }
            return JsonConvert.SerializeObject(result);
        }
    }
}
