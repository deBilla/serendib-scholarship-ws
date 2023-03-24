import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient,  ScanCommand, PutItemCommand, GetItemCommand, DeleteItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const tableName = process.env.SPONSOR_TABLE;
const client = new DynamoDBClient({ region: "us-east-1" });

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let results: any;
    let response: APIGatewayProxyResult;

    try {
        if (event.httpMethod) {
            switch (event.httpMethod) {
                case 'GET':
                    if (event.queryStringParameters && event.queryStringParameters.id != null) {
                        results = await getSponsor(event.queryStringParameters.id);
                    } else {
                        results = await getSponsors();
                    }
                    
                    break;
                case 'POST':
                    results = await createSponsors(event);
                    break;
                case 'PUT':
                    results = await updateSponsors(event)
                    break;
                case 'DELETE':
                    results = await deleteSponsors(event.queryStringParameters.id)
                    break;
                default:
                    throw new Error('Unidentified event!!!');
            }
        } else if (event['Records'][0]['s3']) {
            const key = event['Records'][0]['s3']['object']['key'];
            const id = "f682386e-e34f-4d9f-b6f4-9398fb6a131d";
            results = await updateSponsorFileName(key, id);
        }
        
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({
                message: results,
            }),
        };
    } catch (err: unknown) {
        console.log(err);
        response = {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }

    return response;
};

const getSponsors = async () => {
    try {
        const params = {
            TableName : tableName
        };
        const { Items } = await client.send(new ScanCommand(params));

        return (Items) ? Items.map((s: any) => unmarshall(s)) : [];
    } catch (e) {
        throw e;
    }
}

const getSponsor = async (sponsorId: string) => {
    try {
        const params = {
            TableName: tableName,
            Key: marshall({ id: sponsorId })
        };

        const { Item } = await client.send(new GetItemCommand(params));

        return (Item) ? unmarshall(Item) : {};
    } catch(e) {
        throw e;
    }
}

const createSponsors = async (event: APIGatewayProxyEvent) => {
    try {
        const sponsor = JSON.parse(event.body);
        const sponsorId = uuidv4();
        sponsor.id = sponsorId;

        const params = {
            TableName: tableName,
            Item: marshall(sponsor || {})
        };

        return await client.send(new PutItemCommand(params));
    } catch(e) {
        throw e;
    }
}

const updateSponsors = async (event: APIGatewayProxyEvent) => {
    try {
        const requestBody = JSON.parse(event.body);
        const objKeys = Object.keys(requestBody);   
    
        const params = {
          TableName: tableName,
          Key: marshall({ id: event.queryStringParameters.id }),
          UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
          ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
              ...acc,
              [`#key${index}`]: key,
          }), {}),
          ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
              ...acc,
              [`:value${index}`]: requestBody[key],
          }), {})),
        };
    
        return await client.send(new UpdateItemCommand(params));
    } catch(e) {
        console.error(e);
        throw e;
    }
}

const updateSponsorFileName = async (key: string, id: string) => {
    console.log(key);

    try {
        const paramsGet = {
            TableName: tableName,
            Key: marshall({ id: id })
        };

        const { Item } = await client.send(new GetItemCommand(paramsGet));
        const item = unmarshall(Item);
        console.log(item.files);
        const files = item.files ? [...item.files, {name: key}] : [{name: key}]

        const params = {
          TableName: tableName,
          Item: {
            id: id,
            files: files,
            name: item.name,
            age: item.age
          }
        };

        const docClient = DynamoDBDocumentClient.from(client);

        let res = await docClient.send(new PutCommand(params));
        console.log(res)
    
        return res;
    } catch(e) {
        console.error(e);
        throw e;
    }
}

const deleteSponsors = async (sponsorId: string) => {
    try {
        const params = {
          TableName: tableName,
          Key: marshall({ id: sponsorId }),
        };
    
        return await client.send(new DeleteItemCommand(params));
    } catch(e) {
        throw e;
    }
}
