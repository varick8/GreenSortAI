package services

import (
	"GreenSortAI/config"
	"GreenSortAI/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

func GetUserInfo(accessToken string) (*models.User, error) {
	userInfoEndpoint := "https://www.googleapis.com/oauth2/v2/userinfo"
	resp, err := http.Get(fmt.Sprintf("%s?access_token=%s", userInfoEndpoint, accessToken))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userData); err != nil {
		return nil, err
	}

	user := &models.User{
		GoogleID:   userData["id"].(string),
		Email:      userData["email"].(string),
		FirstName:  userData["given_name"].(string),
		LastName:   userData["family_name"].(string),
		PictureURL: userData["picture"].(string),
	}

	var existingUser models.User
	result := config.DB.Where("google_id = ?", user.GoogleID).First(&existingUser)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			if err := config.DB.Create(user).Error; err != nil {
				return nil, err
			}
			return user, nil
		}
		return nil, result.Error
	}

	return &existingUser, nil
}

func SignJWT(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"google_id": user.GoogleID,
		"name":      user.FirstName + " " + user.LastName,
		"picture":   user.PictureURL,
		"email":     user.Email,
		"exp":       time.Now().Add(time.Hour * 24 * 30).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
