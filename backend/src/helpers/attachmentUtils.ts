import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

const bucketname = process.env.ATTACHMENT_S3_BUCKET
const ExpiresIn = 300

const S3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export const getUpLoadURL = (todoItemId: string) => {
  return S3.getSignedUrl('putObject', {
    Bucket: bucketname,
    Key: todoItemId,
    Expires: ExpiresIn
  })
}


