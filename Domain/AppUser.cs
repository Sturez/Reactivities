using Microsoft.AspNetCore.Identity;

namespace Domain
{
    /// <summary>
    /// Class <c>AppUser</c> defines a user of the application. it is extending the <c>IdentityUser</c> vlass from Microsoft.AspNetCore.Identity.
    /// </summary>
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        public ICollection<ActivityAttendee> Activities { get; set; }

    }
}