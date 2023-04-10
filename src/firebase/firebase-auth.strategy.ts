import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebaseConfig from './firebase.config.json';
import * as firebase from 'firebase-admin';
import { UserService } from 'src/user/user.service';
import { getApps } from 'firebase-admin/app';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url,
};

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private defaultApp: any;
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    private usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    // if (!getApps().length) {
    //   this.defaultApp = firebase.initializeApp({
    //     credential: firebase.credential.cert(firebase_params),
    //   });
    // }
  }
  async validate(token: string) {
    const firebaseUser: any = await this.firebase.auth
      .verifyIdToken(token, true)
      .catch((err) => {
        console.log(err);
        throw new UnauthorizedException(err.message);
      });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }

    if (firebaseUser.email) {
      const user = await this.usersService.findUserByEmail(firebaseUser.email);
      if (!user) {
        const newUser = await this.usersService.createUser(firebaseUser.email);
        return newUser;
      } else {
        return user;
      }
    }

    return firebaseUser;
  }
}
