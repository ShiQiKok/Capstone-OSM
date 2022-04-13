from storages.backends.azure_storage import AzureStorage

class AzureMediaStorage(AzureStorage):
    account_name = 'osmdev' # Must be replaced by your <storage_account_name>
    account_key = 'NVU/LERA2HSgDAA7bWs0x8Phq9fFNfygBQJ7o+tvv6Q0OuDuYYXDkRJQNyY60fQZNwX7BTlWKnCRB99K3t/gIA==' # Must be replaced by your <storage_account_key>
    azure_container = 'media'
    expiration_secs = None