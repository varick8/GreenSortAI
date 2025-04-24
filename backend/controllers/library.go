package controllers

import (
	"GreenSortAI/database"
	"GreenSortAI/models"
	"fmt"
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func AddLibrary(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "Ok",
		"msg":        "Add Library",
	}

	// Extract user_id from request parameters
	userID := c.Params("user_id")

	// Check if user exists
	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		log.Println("User not found:", userID)
		context["statusText"] = "Error"
		context["msg"] = "User does not exist."
		return c.Status(404).JSON(context)
	}

	// Role check: Only admins can add a library
	if user.Role != "admin" {
		log.Println("Unauthorized: User is not an admin.")
		context["statusText"] = "Error"
		context["msg"] = "Only admins can add libraries."
		return c.Status(403).JSON(context)
	}

	// Parse request body into Library struct
	record := new(models.Library)
	if err := c.BodyParser(record); err != nil {
		log.Println("Error in parsing request body.")
		log.Println("BodyParser error:", err)
		context["statusText"] = "Error"
		context["msg"] = "Invalid request payload."
		return c.Status(400).JSON(context)
	}

	// Validate required fields
	if record.Title == "" {
		log.Println("Title is required.")
		context["statusText"] = "Error"
		context["msg"] = "Title is required."
		return c.Status(400).JSON(context)
	}

	if record.Focus == "" {
		log.Println("Focus is required.")
		context["statusText"] = "Error"
		context["msg"] = "Focus is required."
		return c.Status(400).JSON(context)
	}

	if record.Category == "" {
		log.Println("Category is required.")
		context["statusText"] = "Error"
		context["msg"] = "Category is required."
		return c.Status(400).JSON(context)
	}

	if record.Content == "" {
		log.Println("Content is required.")
		context["statusText"] = "Error"
		context["msg"] = "Content is required."
		return c.Status(400).JSON(context)
	}

	if record.Source == "" {
		log.Println("Source is required.")
		context["statusText"] = "Error"
		context["msg"] = "Source is required."
		return c.Status(400).JSON(context)
	}

	if record.Date == "" {
		log.Println("Date is required.")
		context["statusText"] = "Error"
		context["msg"] = "Date is required."
		return c.Status(400).JSON(context)
	}

	parsedDate, err := time.Parse("2006-01-02", record.Date)
	if err != nil {
		log.Println("Invalid date format:", err)
		context["statusText"] = "Error"
		context["msg"] = "Date must be in YYYY-MM-DD format."
		return c.Status(400).JSON(context)
	}

	record.Date = parsedDate.Format("2006-01-02")

	// File upload
	file, err := c.FormFile("image")
	if err != nil || file == nil {
		log.Println("Image is required.")
		context["statusText"] = "Error"
		context["msg"] = "Image is required."
		return c.Status(400).JSON(context)
	}

	// Extract file extension and ensure it's allowed
	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExtensions := map[string]bool{".jpg": true, ".jpeg": true, ".png": true}
	if !allowedExtensions[ext] {
		log.Println("Invalid image format:", ext)
		context["statusText"] = "Error"
		context["msg"] = "Only .jpg, .jpeg, and .png formats are allowed."
		return c.Status(400).JSON(context)
	}

	// Generate a random number for uniqueness
	rand.Seed(time.Now().UnixNano())
	randomNum := rand.Intn(1000000)

	// Generate the filename (without directory)
	filenameOnly := fmt.Sprintf("%s_%d%s", userID, randomNum, ext)

	// Full file path for saving
	filePath := "./static/uploads/library/" + filenameOnly

	// Save the uploaded file
	if err := c.SaveFile(file, filePath); err != nil {
		log.Println("Error in file uploading:", err)
		context["statusText"] = "Error"
		context["msg"] = "Failed to upload image."
		return c.Status(500).JSON(context)
	}

	// Save only the filename in the database
	record.Image = filenameOnly

	// Associate the Library with the User in the many-to-many relationship
	record.UserID = user.ID

	// Save record to the database
	result := database.DB.Create(record)
	if result.Error != nil {
		log.Println("Error in saving data:", result.Error)
		context["statusText"] = "Error"
		context["msg"] = "Failed to save record."
		return c.Status(500).JSON(context)
	}

	context["msg"] = "Record is saved successfully."
	context["data"] = record

	return c.Status(201).JSON(context)
}

func AllLibrary(c *fiber.Ctx) error {

	context := fiber.Map{
		"statusText": "Ok",
		"msg":        "All Library",
	}

	// Sleep to add some delay in API response
	time.Sleep(time.Millisecond * 1500)

	db := database.DB

	var records []models.Library

	db.Find(&records)

	context["library_records"] = records

	c.Status(200)
	return c.JSON(context)
}

func LibraryDetail(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "",
		"msg":        "",
	}

	// Extract user_id from request parameters
	id := c.Params("id")

	parsedID, err := uuid.Parse(id)
	if err != nil {
		log.Println("Invalid ID format:", id)
		context["statusText"] = "Error"
		context["msg"] = "Invalid ID format."
		return c.Status(400).JSON(context)
	}

	var records []models.Library
	if err := database.DB.Where("id = ?", parsedID).Find(&records).Error; err != nil {
		log.Println("Error fetching library records:", err)
		context["statusText"] = "Error"
		context["msg"] = "Failed to retrieve records."
		return c.Status(500).JSON(context)
	}

	// If no records found, return a 404
	if len(records) == 0 {
		log.Println("No library records found for ID:", parsedID)
		context["statusText"] = "Error"
		context["msg"] = "No library records found."
		return c.Status(404).JSON(context)
	}

	context["data"] = records
	context["statusText"] = "Ok"
	context["msg"] = "Library records retrieved successfully."
	return c.Status(200).JSON(context)
}

func LibraryDelete(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "",
		"msg":        "",
	}

	// Get ID from URL params and convert it to UUID
	id := c.Params("id")
	parsedID, err := uuid.Parse(id)
	if err != nil {
		log.Println("Invalid ID format:", id)
		context["statusText"] = "Error"
		context["msg"] = "Invalid ID format."
		return c.Status(400).JSON(context)
	}

	// Find the record by ID
	var record models.Library
	if err := database.DB.First(&record, "id = ?", parsedID).Error; err != nil {
		log.Println("Record not found:", id)
		context["statusText"] = "Error"
		context["msg"] = "Record not found."
		return c.Status(404).JSON(context)
	}

	// Delete the record from the database
	if err := database.DB.Delete(&record).Error; err != nil {
		log.Println("Error deleting record:", err)
		context["statusText"] = "Error"
		context["msg"] = "Failed to delete record."
		return c.Status(500).JSON(context)
	}

	// Remove the associated image file
	if record.Image != "" {
		imagePath := filepath.Join("./static/uploads/library", record.Image)
		if err := os.Remove(imagePath); err != nil && !os.IsNotExist(err) {
			log.Println("Error deleting image file:", err)
		}
	}

	context["statusText"] = "Ok"
	context["msg"] = "Record deleted successfully."
	return c.Status(200).JSON(context)
}

func EditLibrary(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "Ok",
		"msg":        "Edit Library",
	}

	userID := c.Params("user_id")
	libraryID := c.Params("library_id")

	// Check if user exists
	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		log.Println("User not found:", userID)
		context["statusText"] = "Error"
		context["msg"] = "User does not exist."
		return c.Status(404).JSON(context)
	}

	// Role check: Only admins can edit a library
	if user.Role != "admin" {
		log.Println("Unauthorized: User is not an admin.")
		context["statusText"] = "Error"
		context["msg"] = "Only admins can edit libraries."
		return c.Status(403).JSON(context)
	}

	// Fetch existing library record
	var library models.Library
	if err := database.DB.First(&library, "id = ?", libraryID).Error; err != nil {
		log.Println("Library not found:", libraryID)
		context["statusText"] = "Error"
		context["msg"] = "Library not found."
		return c.Status(404).JSON(context)
	}

	// Parse request body
	updateData := new(models.Library)
	if err := c.BodyParser(updateData); err != nil {
		log.Println("Error parsing request body:", err)
		context["statusText"] = "Error"
		context["msg"] = "Invalid request payload."
		return c.Status(400).JSON(context)
	}

	// Preserve existing values if not provided in the request
	if updateData.Title == "" {
		updateData.Title = library.Title
	}
	if updateData.Focus == "" {
		updateData.Focus = library.Focus
	}
	if updateData.Category == "" {
		updateData.Category = library.Category
	}
	if updateData.Content == "" {
		updateData.Content = library.Content
	}
	if updateData.Source == "" {
		updateData.Source = library.Source
	}
	if updateData.Date == "" {
		updateData.Date = library.Date
	} else {
		parsedDate, err := time.Parse("2006-01-02", updateData.Date)
		if err != nil {
			log.Println("Invalid date format:", err)
			context["statusText"] = "Error"
			context["msg"] = "Date must be in YYYY-MM-DD format."
			return c.Status(400).JSON(context)
		}
		updateData.Date = parsedDate.Format("2006-01-02")
	}

	// File upload (optional update)
	file, err := c.FormFile("image")
	if err == nil && file != nil {
		ext := strings.ToLower(filepath.Ext(file.Filename))
		allowedExtensions := map[string]bool{".jpg": true, ".jpeg": true, ".png": true}

		if !allowedExtensions[ext] {
			log.Println("Invalid image format:", ext)
			context["statusText"] = "Error"
			context["msg"] = "Only .jpg, .jpeg, and .png formats are allowed."
			return c.Status(400).JSON(context)
		}

		// Generate unique filename
		rand.Seed(time.Now().UnixNano())
		randomNum := rand.Intn(1000000)
		filenameOnly := fmt.Sprintf("%s_%d%s", userID, randomNum, ext)
		filePath := "./static/uploads/library/" + filenameOnly

		// Delete the old image file if it exists
		if library.Image != "" {
			oldFilePath := "./static/uploads/library/" + library.Image
			if _, err := os.Stat(oldFilePath); err == nil {
				err := os.Remove(oldFilePath)
				if err != nil {
					log.Println("Failed to delete old image:", err)
				}
			}
		}

		// Save the uploaded file
		if err := c.SaveFile(file, filePath); err != nil {
			log.Println("Error in file uploading:", err)
			context["statusText"] = "Error"
			context["msg"] = "Failed to upload image."
			return c.Status(500).JSON(context)
		}

		// Update the image filename
		updateData.Image = filenameOnly
	} else {
		// Keep the old image if no new file is uploaded
		updateData.Image = library.Image
	}

	// Update the record
	if err := database.DB.Model(&library).Updates(updateData).Error; err != nil {
		log.Println("Error updating data:", err)
		context["statusText"] = "Error"
		context["msg"] = "Failed to update record."
		return c.Status(500).JSON(context)
	}

	context["msg"] = "Record updated successfully."
	context["data"] = updateData

	return c.Status(200).JSON(context)
}
