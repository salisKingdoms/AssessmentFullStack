using Assessment.Config;
using Assessment.Data.dto;
using Assessment.Data.Repository;
using Assessment.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Assessment.Data.dto;

namespace Assessment.Controllers
{
    public class CreditCardController : Controller
    {
        private readonly CreditCardRepo _ccRepo;
        public CreditCardController(CreditCardRepo repo)
        {
            _ccRepo = repo;
        }
        public IActionResult CreditCards()
        {
            return View();
        }

        [HttpGet]
        public string GetBankTypeByNo(string ccNo)
        {
            RespCreditCard result = new RespCreditCard();
            try
            {
                var cc = _ccRepo.GetListCCByNo(ccNo).FirstOrDefault();
                result.bank = cc.bank;
                result.cc_type = cc.creadit_type;
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
    }
}
