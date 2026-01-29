using System.ComponentModel.DataAnnotations;

namespace ContactManager.Models
{
    public class Contact
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Имя обязательно")]
        [StringLength(100, ErrorMessage = "Имя не может превышать 100 символов")]
        public string Name { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Мобильный телефон обязателен")]
        public string MobilePhone { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Должность не может превышать 100 символов")]
        public string? JobTitle { get; set; }
        
        public DateTime? BirthDate { get; set; }
        
        public DateTime CreatedDate { get; set; }
        
        public DateTime UpdatedDate { get; set; }

        // Метод для форматирования телефона
        public string GetFormattedPhone()
        {
            return MobilePhone;
        }
    }
}