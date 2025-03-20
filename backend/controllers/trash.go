package controllers

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"time"

	"GreenSortAI/database"
	"GreenSortAI/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func ScanTrash(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "Ok",
		"msg":        "Scan Trash",
	}

	// Extract user_id from request parameters
	userID := c.Params("user_id")

	// Check if user_id exists in the users table
	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		log.Println("User not found:", userID)
		context["statusText"] = "Error"
		context["msg"] = "User does not exist."
		return c.Status(404).JSON(context)
	}

	// Parse request body into Trash struct
	record := new(models.Trash)
	if err := c.BodyParser(record); err != nil {
		log.Println("Error in parsing request body.")
		context["statusText"] = "Error"
		context["msg"] = "Invalid request payload."
		return c.Status(400).JSON(context)
	}

	// Validate required fields
	if record.Type == "" {
		log.Println("Type is required.")
		context["statusText"] = "Error"
		context["msg"] = "Type is required."
		return c.Status(400).JSON(context)
	}

	if record.Recommendation == "" {
		log.Println("Recommendation is required.")
		context["statusText"] = "Error"
		context["msg"] = "Recommendation is required."
		return c.Status(400).JSON(context)
	}

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
	filePath := "./static/uploads/trash/" + filenameOnly

	// Save the uploaded file
	if err := c.SaveFile(file, filePath); err != nil {
		log.Println("Error in file uploading:", err)
		context["statusText"] = "Error"
		context["msg"] = "Failed to upload image."
		return c.Status(500).JSON(context)
	}

	// Save only the filename in the database
	record.Image = filenameOnly

	record.UserID = userID // Assign user ID from URL params

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

func TrashDetail(c *fiber.Ctx) error {
	context := fiber.Map{
		"statusText": "",
		"msg":        "",
	}

	// Extract user_id from request parameters
	userID := c.Params("user_id")

	// Check if user_id exists in the users table
	var user models.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		log.Println("User not found:", userID)
		context["statusText"] = "Error"
		context["msg"] = "User does not exist."
		return c.Status(404).JSON(context)
	}

	// Retrieve all trash records for the given user_id
	var records []models.Trash
	if err := database.DB.Where("user_id = ?", userID).Find(&records).Error; err != nil {
		log.Println("Error fetching trash records:", err)
		context["statusText"] = "Error"
		context["msg"] = "Failed to retrieve records."
		return c.Status(500).JSON(context)
	}

	// If no records found, return a 404
	if len(records) == 0 {
		log.Println("No trash records found for user ID:", userID)
		context["statusText"] = "Error"
		context["msg"] = "No trash records found."
		return c.Status(404).JSON(context)
	}

	context["data"] = records
	context["statusText"] = "Ok"
	context["msg"] = "Trash records retrieved successfully."
	return c.Status(200).JSON(context)
}

func TrashDelete(c *fiber.Ctx) error {
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
	var record models.Trash
	if err := database.DB.First(&record, "id = ?", parsedID).Error; err != nil {
		log.Println("Record not found:", id)
		context["statusText"] = "Error"
		context["msg"] = "Record not found."
		return c.Status(404).JSON(context)
	}

	// Remove the associated image file
	if record.Image != "" {
		imagePath := filepath.Join("./static/uploads/trash", record.Image)
		if err := os.Remove(imagePath); err != nil && !os.IsNotExist(err) {
			log.Println("Error deleting image file:", err)
		}
	}

	// Delete the record from the database
	if err := database.DB.Delete(&record).Error; err != nil {
		log.Println("Error deleting record:", err)
		context["statusText"] = "Error"
		context["msg"] = "Failed to delete record."
		return c.Status(500).JSON(context)
	}

	context["statusText"] = "Ok"
	context["msg"] = "Record deleted successfully."
	return c.Status(200).JSON(context)
}
