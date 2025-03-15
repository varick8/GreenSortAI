package routes

import (
	"GreenSortAI/controllers"

	"github.com/gofiber/fiber/v2"
)

func welcome(c *fiber.Ctx) error {
	return c.SendString("Kelompok Eko Backend Service")
}

func SetupRoutes(app *fiber.App) {
	// Welcome endpoint
	app.Get("/api", welcome)

	app.Static("api/uploads", "./static/uploads/trash")

	// Auth endpoints
	app.Get("/api/auth/google/login", controllers.GoogleLoginHandler)
	app.Get("/api/auth/google/callback", controllers.GoogleCallbackHandler)

	// Trash endpoints
	app.Post("/api/trash/scan/:user_id", controllers.ScanTrash)
	app.Get("/api/trash/user/:user_id", controllers.TrashDetail)
	app.Static("api/trash/image", "./static/uploads/trash")
	app.Delete("/api/trash/:id", controllers.TrashDelete)

	// Library endpoints
	app.Post("/api/library/add/:user_id", controllers.AddLibrary)
	app.Static("api/library/image", "./static/uploads/library")
	app.Get("/api/library", controllers.AllLibrary)
	app.Get("/api/library/:id", controllers.LibraryDetail)
	app.Delete("/api/library/:id", controllers.LibraryDelete)
	app.Put("/api/library/edit/:user_id/:library_id", controllers.EditLibrary)
}
