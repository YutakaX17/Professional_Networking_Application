# Flask-Migrate setup:

**Install requirements:**
```bash
pip install Flask-Migrate psycopg2-binary
```

**Create migration directory:**
```bash
flask db init   
```
**/ Navigate to the file's directory and run:**
```bash
flask --app __init__.py db init
```
**Create first migration:**
```bash
flask db migrate -m "Initial migration" / flask --app __init__.py db migrate -m "Initial migration"
```
> Create Schema if not exists in Postgres

**Apply migration:**
```bash
flask db upgrade / flask --app __init__.py db upgrade
```


### Create profile:
```bash
curl -X POST http://127.0.0.1:5000/seeker/profile/create \
  -F "user_id=2" \
  -F "bio=Skilled Software Engineer with plenty of experience" \
  -F "full_name=Jason Thorn" \
  -F "phone=0999224467" \
  -F "location=Lilongwe" \
  -F "skills=Python" \
  -F "skills=Django" \
  -F 'experience={"years": 5, "roles": ["Engineer"]}' \
  -F 'education={"degree": "BSc Computer Science", "university": "ABC University"}' \
  -F "profile_picture=@G:/Projects/Personal Projects/social_networking_app/Social_Messaging_app/frontend/src/resources/images/profile3.jpg"
  ```

### Basic update without profile picture:
```bash
curl -X PUT http://127.0.0.1:5000/seeker/profile/1 \
  -F "bio=Data Management Assistant at National Local Government Finance Committee" \
  -F "full_name=Docman Namulu" \
  -F "phone=9876543210" \
  -F "location=Blantyre" \
  -F "skills=C#" \
  -F "skills=Python" \
  -F "skills=SQL" \
  -F 'experience={"years": 6, "roles": ["Senior Developer"]}' \
  -F 'education={"degree": "MSc Computer Science", "university": "Greenwich University"}'
  ```

### Update with a new profile picture:
```bash
curl -X PUT http://127.0.0.1:5000/seeker/profile/1 \
  -F "bio=Updated bio" \
  -F "full_name=Updated Name" \
  -F "phone=9876543210" \
  -F "location=Updated Location" \
  -F "skills=Python" \
  -F "skills=Flask" \
  -F "skills=SQL" \
  -F 'experience={"years": 6, "roles": ["Senior Developer"]}' \
  -F 'education={"degree": "MSc Computer Science", "university": "ABC University"}' \
  -F "profile_picture=@G:/Projects/Personal Projects/social_networking_app/Social_Messaging_app/frontend/src/resources/images/rb_47764.png"
```

 ### Partial update (only updating specific fields):
```bash
 curl -X PUT http://127.0.0.1:5000/seeker/profile/1 \
  -F "bio=Updated bio only" \
  -F "skills=Python" \
  -F "skills=React"
```

### Retrieve Profile (GET)
```bash
curl http://127.0.0.1:5000/seeker/profile/2
```
### Get only the profile picture path:
```bash
curl "http://127.0.0.1:5000/seeker/profile/1?fields=profile_picture_path"
```
### Get multiple specific fields:
```bash
curl "http://127.0.0.1:5000/seeker/profile/1?fields=profile_picture_path,full_name,skills"
```

### Testing Google OAuth2
1. Go to Google Cloud Console https://cloud.google.com/cloud-console
2. Create a new project or select existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen:

>1. User Type: External
>2. App name, logo, etc
>3. Add your email as developer contact.


### For authorized redirect URIs add:

>http://localhost:3000/google-callback
http://127.0.0.1:3000/google-callback


### For authorized JavaScript origins add:
> http://localhost:3000
> 
> http://127.0.0.1:3000


### After creating, you'll get:

>1. Client ID 
>2. Client Secret


## Register
```bash
curl -X POST http://localhost:5000/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"tanya","email":"tanyasmithie8@gmail.com","password":"Ge4for#ce87","role":"Seeker"}'
```
## Login
```bash
curl -X POST http://localhost:5000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"sashoore6@gmail.com","password":"TestPass123"}'
```

>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJyb2xlIjoiU2Vla2VyIiwiZXhwIjoxNzM1MzI4MDAzfQ.uB43N-No6da9KaxQYBJyemTW2v1Z3dMxze731-UYpBY
### Endpoints
```bash
curl -X POST http://localhost:5000/auth/forgot-password \
-H "Content-Type: application/json" \
-d '{"email": "tanyasmithie8@gmail.com"}'


curl -X POST http://127.0.0.1:5000/auth/reset-password \
-H "Content-Type: application/json" \
-d '{"reset_token": "valid_reset_token", "new_password": "NewP@ssword123"}'

curl -X POST http://127.0.0.1:5000/auth/reset-password \
-H "Content-Type: application/json" \
-d '{"reset_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJleHAiOjE3MzUzMzU4OTF9.NRfPCEu9OA862aL2YcDyDGXgg5AsBlr5STFhFNhPPEg", "new_password": "NewP@ssword123"}'

curl -X GET http://localhost:5000/protected-route -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJyb2xlIjoiU2Vla2VyIiwiZXhwIjoxNzM1MzI1NjYzfQ.rITpTAVZM7J1w8X9IPOF3lhZlCd4PzsT8S18mj8xFOI"



curl -X POST http://localhost:5000/auth/reset-password \
-H "Content-Type: application/json" \
-d '{"reset_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3MzUzNDQxNDR9.aMqIBb__7oepzqP1ckl1AilxS2YDON58Jof7GHLbiUQ", "new_password": "N$WP@ssWor568H"}'


$ curl -X POST -H "Content-Type: application/json" -d '{"email": "pkadembo@nlgfc.gov.mw", "password": "AdmiN#123", "username": "admin"}' http://localhost:5000/auth/admin/register
{"message":"Admin user created successfully","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJyb2xlIjoiQWRtaW4iLCJleHAiOjE3MzYyOTkxODl9.cAkndy6vMACZRZsBdb-Xy4c6GtJVtPHfPwA5z2v1QPQ"}
```

````
// ...

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email,
      password,
      role,
    });

    // Handle the response
    const { token, role } = response.data;
    localStorage.setItem('token', token);

    if (role === 'Seeker') {
      navigate('/seeker/dashboard');
    } else if (role === 'Publisher') {
      navigate('/publisher/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    // Handle the error, show an error message, etc.
  }
};

// ...

<form onSubmit={handleLogin}>
  {/* ... */}
</form>

// ...
````


```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <admin_token>" -d '{"name": "Category Name", "description": "Category Description"}' http://localhost:5000/admin/job-categories
name: Healthcare, Technology, Finance, Engineering, Agriculture, Design, Marketing, Sales, HR, Legal, Customer Support, Other
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <admin_token>" -d '{"name": "Type Name", "description": "Type Description"}' http://localhost:5000/admin/job-types
name: Full-time, Part-time, Internship, Contract, Freelance, Temporary, Volunteer, Apprenticeship, Seasonal, Permanent, Other
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <admin_token>" -d '{"name": "Status Name", "description": "Status Description"}' http://localhost:5000/admin/job-statuses
name: Active, Inactive, Draft, Archived, Pending, Closed, Filled, Cancelled, On Hold, Suspended, Archived, Deleted
```