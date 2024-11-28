provider "google" {
  project = "dev-vms-jacob"
  region  = "us-central1"
}

resource "google_storage_bucket" "app_bucket" {
  name     = "devtools-bucket"    # Replace with a unique bucket name
  location = "US"
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
  force_destroy = true                 # Allows deletion even if bucket isn't empty
}

resource "google_storage_bucket_object" "app_files" {
  for_each = fileset("${path.module}/src", "**") # Upload all files
  name     = each.value
  bucket   = google_storage_bucket.app_bucket.name
  source   = "${path.module}/src/${each.value}"

  content_type = lookup({
    "html" = "text/html",
    "css"  = "text/css",
    "js"   = "application/javascript"
  }, coalesce(regex(".*\\.(html|css|js)$", each.value)[0], ""), "application/octet-stream")
}

resource "google_storage_bucket_iam_binding" "public_read" {
  bucket = google_storage_bucket.app_bucket.name
  role   = "roles/storage.objectViewer"
  members = ["allUsers"]
}

output "bucket_url" {
  value = "http://${google_storage_bucket.app_bucket.name}.storage.googleapis.com"
}
