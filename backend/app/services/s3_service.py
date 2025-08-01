import boto3
import os

class S3Service:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION"),
        )
        self.bucket = os.getenv("AWS_S3_BUCKET")

    def upload_fileobj(self, file_obj, key):
        self.s3.upload_fileobj(file_obj, self.bucket, key)
        return f"https://{self.bucket}.s3.amazonaws.com/{key}"

    def delete_file(self, key):
        self.s3.delete_object(Bucket=self.bucket, Key=key)
