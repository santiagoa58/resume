import boto3
from typing import Any, Dict
from botocore.exceptions import ClientError
import json


# AWS Secrets Manager class
class SecretsManager:
    def __init__(self, region_name: str):
        # Create a Secrets Manager client
        session = boto3.session.Session()
        self.client = session.client(
            service_name="secretsmanager", region_name=region_name
        )

    # gets secret from AWS Secrets Manager
    def get_secret(self, secret_name: str) -> Dict[str, Any]:
        try:
            get_secret_value_response = self.client.get_secret_value(
                SecretId=secret_name
            )
        except ClientError as e:
            # For a list of exceptions thrown, see
            # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
            raise e

        # Decrypts secret using the associated KMS key.
        secret = get_secret_value_response["SecretString"]
        return json.loads(secret)
