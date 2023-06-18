FROM python:3.7-slim-buster

ARG REQUIREMENTS_FILE

COPY ./lambdas/ .
COPY ./requirements/${REQUIREMENTS_FILE}.txt ./requirements.txt

# Install necessary packages for the ODBC driver
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    unixodbc-dev

# Add the Microsoft repository key
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -

# Add the Microsoft SQL Server Ubuntu repository
RUN curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list

# Install the driver
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17

# Install SQL Server command line tools
RUN ACCEPT_EULA=Y apt-get install -y mssql-tools
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc

RUN python3.7 -m pip install awslambdaric
RUN python3.7 -m pip install -r requirements.txt

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
