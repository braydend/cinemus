package utils

import "testing"

func TestGetSubjectFromJwtDataString(t *testing.T) {
	type args struct {
		input string
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr bool
	}{
		{
			name: "Correctly parses subject from string (auth0 provider)",
			args: args{
				input: "map[claims:map[aud:[https://fph4gxpg5c.execute-api.ap-southeast-2.amazonaws.com https://dev-pt5nxvvf.au.auth0.com/userinfo] azp:XFquV2psiu7v2mhCqcjZdPU0lkdgOFCJ exp:1677992941 iat:1677906541 iss:https://dev-pt5nxvvf.au.auth0.com/ scope:openid profile email sub:auth0|63fd31f5d7ea5c12c38c52f6] scopes:<nil>]",
			},
			want:    "63fd31f5d7ea5c12c38c52f6",
			wantErr: false,
		},
		{
			name: "Correctly parses subject from string (other provider)",
			args: args{
				input: "map[claims:map[aud:[https://fph4gxpg5c.execute-api.ap-southeast-2.amazonaws.com https://dev-pt5nxvvf.au.auth0.com/userinfo] azp:XFquV2psiu7v2mhCqcjZdPU0lkdgOFCJ exp:1677992941 iat:1677906541 iss:https://dev-pt5nxvvf.au.auth0.com/ scope:openid profile email sub:foo|63fd31f5d7ea5c12c38c52f6] scopes:<nil>]",
			},
			want:    "63fd31f5d7ea5c12c38c52f6",
			wantErr: false,
		},
		{
			name: "Returns error if subject cannot be found",
			args: args{
				input: "",
			},
			want:    "",
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetSubjectFromJwtDataString(tt.args.input)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetSubjectFromJwtDataString() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("GetSubjectFromJwtDataString() got = %v, want %v", got, tt.want)
			}
		})
	}
}
