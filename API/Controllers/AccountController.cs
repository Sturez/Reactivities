using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/account")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            this._tokenService = tokenService;
            this._userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized();

            var isValidPassword = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!isValidPassword)
                return Unauthorized();

            return CreateUserObject(user);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.Username))
                ModelState.AddModelError("username", "Username taken");

            if (await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
                ModelState.AddModelError("email", "Email taken");

            if (!ModelState.IsValid)
                return ValidationProblem();

            var user = new AppUser
            {
                UserName = registerDto.Username,
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email
            };

            var createdUser = await _userManager.CreateAsync(user, registerDto.Password);

            if (createdUser.Succeeded)
                return CreateUserObject(user);

            return BadRequest(createdUser.Errors);
        }


        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        private ActionResult<UserDto> CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = null,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}