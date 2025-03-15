package controllers

import (
	"GreenSortAI/database"
	"GreenSortAI/models"
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
)

var googleOauthConfig *oauth2.Config

func SetGoogleOauthConfig(config *oauth2.Config) {
	googleOauthConfig = config
}

// GoogleLoginHandler - Redirects user to Google OAuth
func GoogleLoginHandler(c *fiber.Ctx) error {
	url := googleOauthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	return c.Redirect(url)
}

// GoogleCallbackHandler - Handles Google OAuth callback
func GoogleCallbackHandler(c *fiber.Ctx) error {
	code := c.Query("code")
	if code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Code not provided"})
	}

	// Exchange code for token
	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to exchange token"})
	}

	// Fetch user info
	userInfo, err := getUserInfo(token.AccessToken)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch user info"})
	}

	// Save user to database
	var user models.User
	database.DB.Where(models.User{ID: userInfo["id"].(string)}).
		FirstOrCreate(&user, models.User{
			ID:         userInfo["id"].(string),
			Email:      userInfo["email"].(string),
			FirstName:  userInfo["given_name"].(string),
			LastName:   userInfo["family_name"].(string),
			PictureURL: userInfo["picture"].(string),
		})

	// Generate JWT
	jwtToken, err := signJWT(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": jwtToken, "user": user})
}

// Fetch user info from Google API
func getUserInfo(accessToken string) (map[string]interface{}, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}
	return userInfo, nil
}

// Sign JWT token
func signJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"id":      user.ID,
		"email":   user.Email,
		"name":    user.FirstName + " " + user.LastName,
		"fname":   user.FirstName,
		"lname":   user.LastName,
		"picture": user.PictureURL,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
