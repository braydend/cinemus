package utils

import (
	"log"
	"os"
)

func GetEnvVar(key string) (val string) {
	val = os.Getenv(key)

	if len(val) == 0 {
		log.Fatalf("Environment vaiable %s not found", key)
	}

	return val
}
