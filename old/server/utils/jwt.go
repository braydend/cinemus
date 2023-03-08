package utils

import (
	"fmt"
	"regexp"
)

func GetSubjectFromJwtDataString(input string) (string, error) {
	subjectFieldRegex := regexp.MustCompile(`sub:([^|]+)\|\w+`)
	providerRegex := regexp.MustCompile(`([^|]+)\|`)
	subjectField := subjectFieldRegex.FindString(input)
	match := providerRegex.ReplaceAllString(subjectField, "")

	if len(match) == 0 {
		return "", fmt.Errorf("failed to find subject in string: %s", input)
	}

	return match, nil
}
