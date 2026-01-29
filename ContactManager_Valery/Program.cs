using ContactManager.Data;
using ContactManager.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Добавляем сервисы в контейнер
builder.Services.AddControllersWithViews();

// Настраиваем базу данных SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=contacts.db"));

var app = builder.Build();

// Настраиваем конвейер HTTP запросов
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Инициализация базы данных с начальными данными (ровно 5 контактов)
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        // Создаем базу данных если её нет
        await dbContext.Database.EnsureCreatedAsync();
        
        // Проверяем, есть ли уже данные
        if (!dbContext.Contacts.Any())
        {
            // Создаем ровно 5 начальных контактов
            var contacts = new List<Contact>
            {
                new Contact 
                { 
                    Name = "Иван Иванов", 
                    MobilePhone = "+7 (912) 345-67-89", 
                    JobTitle = "Менеджер по продажам",
                    BirthDate = new DateTime(1990, 5, 15)
                },
                new Contact 
                { 
                    Name = "Мария Петрова", 
                    MobilePhone = "+375 (29) 123-45-67", 
                    JobTitle = "Дизайнер UI/UX",
                    BirthDate = new DateTime(1985, 8, 22)
                },
                new Contact 
                { 
                    Name = "Алексей Сидоров", 
                    MobilePhone = "+380 (95) 678-90-12", 
                    JobTitle = "Backend разработчик",
                    BirthDate = new DateTime(1992, 3, 10)
                },
                new Contact 
                { 
                    Name = "Екатерина Козлова", 
                    MobilePhone = "+7 (916) 234-56-78", 
                    JobTitle = "Маркетолог",
                    BirthDate = new DateTime(1988, 11, 30)
                },
                new Contact 
                { 
                    Name = "Дмитрий Николаев", 
                    MobilePhone = "+375 (33) 456-78-90", 
                    JobTitle = "Аналитик данных",
                    BirthDate = new DateTime(1995, 7, 18)
                }
            };
            
            dbContext.Contacts.AddRange(contacts);
            await dbContext.SaveChangesAsync();
            
            Console.WriteLine("✅ База данных инициализирована с 5 начальными контактами");
        }
        else
        {
            var count = await dbContext.Contacts.CountAsync();
            Console.WriteLine($"📊 В базе данных уже есть {count} контактов");
            
            // Если больше 5 контактов, удаляем лишние
            if (count > 5)
            {
                var extraContacts = await dbContext.Contacts
                    .OrderByDescending(c => c.CreatedDate)
                    .Skip(5)
                    .ToListAsync();
                
                dbContext.Contacts.RemoveRange(extraContacts);
                await dbContext.SaveChangesAsync();
                Console.WriteLine($"🗑️ Удалено {extraContacts.Count} лишних контактов");
            }
        }
    }
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Ошибка при инициализации базы данных: {ex.Message}");
}

await app.RunAsync();