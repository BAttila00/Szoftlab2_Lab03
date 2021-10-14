using ChattR.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ChattR.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public UserController(UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public UserManager<IdentityUser> UserManager { get; }
        public SignInManager<IdentityUser> SignInManager { get; }

        [HttpPost("signin")]
        public async Task<ActionResult<UserModel>> SignIn(UserNamePasswordModel model)
        {
            var signInResult = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);
            if (signInResult.Succeeded)
            {
                var user = await UserManager.FindByNameAsync(model.UserName);
                return new UserModel { Id = user.Id, Name = user.UserName };
            }
            return StatusCode((int)HttpStatusCode.Unauthorized, new[] { (await UserManager.FindByNameAsync(model.UserName)) != null ? "Invalid password" : "Invalid username or password" });
        }

        [HttpPost("signup")]
        public async Task<ActionResult<UserModel>> SignUp(UserNamePasswordModel model)
        {
            if ((await UserManager.FindByNameAsync(model.UserName)) != null)
                return BadRequest(new[] { "The given username is taken." });
            var createResult = await UserManager.CreateAsync(new IdentityUser { UserName = model.UserName }, model.Password);
            if (createResult.Succeeded)
                return await SignIn(model);
            return BadRequest(createResult.Errors.Select(e => e.Description));
        }

        [HttpPost("signout")]
        public async Task<ActionResult> SignOut()
        {
            await SignInManager.SignOutAsync();
            return NoContent();
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserModel>> GetUser()
        {
            var user = await UserManager.GetUserAsync(User);
            return new UserModel { Id = user.Id, Name = user.UserName };
        }

        public class UserModel
        {
            public string Id { get; set; }
            public string Name { get; set; }
        }

        public class UserNamePasswordModel
        {
            public string UserName { get; set; }
            public string Password { get; set; }
        }
    }
}