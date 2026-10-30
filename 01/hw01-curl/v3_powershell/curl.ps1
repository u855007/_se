param(
    [Parameter(Mandatory=$true)][string]$Resource,
    [Parameter(Mandatory=$true)][string]$Id
)

$HostName = "jsonplaceholder.typicode.com"
$Port = 443
$Path = "/$Resource/$Id"

try {
    # Create TCP Client
    $TcpClient = New-Object System.Net.Sockets.TcpClient($HostName, $Port)
    $NetworkStream = $TcpClient.GetStream()

    # Wrap with SSL Stream
    $SslStream = New-Object System.Net.Security.SslStream($NetworkStream, $false)
    $SslStream.AuthenticateAsClient($HostName)

    # Construct HTTP Request
    $Request = "GET $Path HTTP/1.1`r`n" +
               "Host: $HostName`r`n" +
               "Connection: close`r`n" +
               "`r`n"

    $RequestBytes = [System.Text.Encoding]::UTF8.GetBytes($Request)
    $SslStream.Write($RequestBytes, 0, $RequestBytes.Length)

    # Read Response
    $ResponseBytes = New-Object System.Collections.Generic.List[byte]
    $Buffer = New-Object byte[] 4096
    while (($Read = $SslStream.Read($Buffer, 0, $Buffer.Length)) -gt 0) {
        for ($i = 0; $i -lt $Read; $i++) {
            $ResponseBytes.Add($Buffer[$i])
        }
    }

    $SslStream.Close()
    $TcpClient.Close()

    # Process Response
    $FullResponse = [System.Text.Encoding]::UTF8.GetString($ResponseBytes.ToArray())
    $Parts = $FullResponse -split "`r`n`r`n", 2
    if ($Parts.Count -lt 2) { exit 1 }

    $Headers = $Parts[0]
    $Body = $Parts[1]

    # Check for 200 OK
    if ($Headers -notmatch "HTTP/1.1 200 OK") {
        exit 1
    }

    # Handle Chunked Transfer Encoding
    if ($Headers -match "Transfer-Encoding: chunked") {
        $DecodedBody = New-Object System.Text.StringBuilder
        $Offset = 0
        $BodyBytes = [System.Text.Encoding]::UTF8.GetBytes($Body)

        while ($Offset -lt $BodyBytes.Length) {
            # Find end of chunk size line
            $LineEnd = [Array]::IndexOf($BodyBytes, [byte]13, $Offset) # Find \r
            if ($LineEnd -eq -1) { break }

            # Verify it is \r\n
            if ($BodyBytes[$LineEnd + 1] -ne 10) { break }

            $SizeStr = [System.Text.Encoding]::UTF8.GetString($BodyBytes, $Offset, $LineEnd - $Offset)
            try {
                $ChunkSize = [Convert]::ToInt32($SizeStr, 16)
            } catch {
                break
            }

            if ($ChunkSize -eq 0) { break }

            # Move to data
            $Offset = $LineEnd + 2
            if ($Offset + $ChunkSize -gt $BodyBytes.Length) { break }

            $ChunkData = [System.Text.Encoding]::UTF8.GetString($BodyBytes, $Offset, $ChunkSize)
            [void]$DecodedBody.Append($ChunkData)

            # Skip \r\n
            $Offset += $ChunkSize + 2
        }
        Write-Output $DecodedBody.ToString()
    } else {
        Write-Output $Body
    }

} catch {
    exit 1
}
