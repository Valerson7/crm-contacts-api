using ContactManager.Data;
using ContactManager.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContactManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactsApiController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ContactsApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetContacts()
        {
            var contacts = await _context.Contacts
                .OrderByDescending(c => c.CreatedDate)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.MobilePhone,
                    c.JobTitle,
                    c.BirthDate,
                    c.CreatedDate,
                    c.UpdatedDate
                })
                .ToListAsync();
                
            return Ok(contacts);
        }

        // GET: api/ContactsApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound(new { message = "Контакт не найден" });
            }

            return contact;
        }

        // PUT: api/ContactsApi/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            if (id != contact.Id)
            {
                return BadRequest(new { message = "ID контакта не совпадает" });
            }

            // Валидация
            if (string.IsNullOrWhiteSpace(contact.Name))
            {
                return BadRequest(new { message = "Имя обязательно" });
            }

            if (string.IsNullOrWhiteSpace(contact.MobilePhone))
            {
                return BadRequest(new { message = "Мобильный телефон обязателен" });
            }

            // Проверяем существует ли контакт
            var existingContact = await _context.Contacts.FindAsync(id);
            if (existingContact == null)
            {
                return NotFound(new { message = "Контакт не найден" });
            }

            // Обновляем данные
            existingContact.Name = contact.Name;
            existingContact.MobilePhone = contact.MobilePhone;
            existingContact.JobTitle = contact.JobTitle;
            existingContact.BirthDate = contact.BirthDate;
            existingContact.UpdatedDate = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { 
                    message = "Контакт успешно обновлен", 
                    contact = new
                    {
                        existingContact.Id,
                        existingContact.Name,
                        existingContact.MobilePhone,
                        existingContact.JobTitle,
                        existingContact.BirthDate,
                        existingContact.CreatedDate,
                        existingContact.UpdatedDate
                    }
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
                {
                    return NotFound(new { message = "Контакт не найден" });
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/ContactsApi
        [HttpPost]
        public async Task<ActionResult<object>> PostContact(Contact contact)
        {
            // Валидация
            if (string.IsNullOrWhiteSpace(contact.Name))
            {
                return BadRequest(new { message = "Имя обязательно" });
            }

            if (string.IsNullOrWhiteSpace(contact.MobilePhone))
            {
                return BadRequest(new { message = "Мобильный телефон обязателен" });
            }

            // Установка дат
            contact.CreatedDate = DateTime.Now;
            contact.UpdatedDate = DateTime.Now;

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContact", new { id = contact.Id }, 
                new { 
                    message = "Контакт успешно создан", 
                    contact = new
                    {
                        contact.Id,
                        contact.Name,
                        contact.MobilePhone,
                        contact.JobTitle,
                        contact.BirthDate,
                        contact.CreatedDate,
                        contact.UpdatedDate
                    }
                });
        }

        // DELETE: api/ContactsApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound(new { message = "Контакт не найден" });
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Контакт успешно удален" });
        }

        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }
    }
}