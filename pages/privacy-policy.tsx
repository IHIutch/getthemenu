import {
  Box,
  Container,
  Heading,
  Link,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import { Prose } from '@nikolovlazar/chakra-ui-prose'
import Head from 'next/head'
import NextLink from 'next/link'
import React from 'react'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <Container w="full" maxW="container.md" my="12">
        <Box mb="8">
          <Heading as="h1" size="lg" mb="2">
            Privacy Policy
          </Heading>
          <Text>
            <Text as="span" fontWeight="semibold">
              Last updated:
            </Text>
            {' '}
            June 25, 2022
          </Text>
        </Box>
        <Box mb="12">
          <Text mb="4">
            This privacy notice for GetTheMenu, LLC (doing business as
            GetTheMenu) (&quot;
            <Text as="span" fontWeight="semibold">
              GetTheMenu
            </Text>
            ,&quot; &quot;
            <Text as="span" fontWeight="semibold">
              we
            </Text>
            ,&quot; &quot;
            <Text as="span" fontWeight="semibold">
              us
            </Text>
            ,&quot; or &quot;
            <Text as="span" fontWeight="semibold">
              our
            </Text>
            &quot;), describes how and why we might collect, store, use, and/or
            share (&quot;
            <Text as="span" fontWeight="semibold">
              process
            </Text>
            &quot;) your information when you use our services (&quot;
            <Text as="span" fontWeight="semibold">
              Services
            </Text>
            &quot;), such as when you:
          </Text>
          <UnorderedList spacing="4" mb="8">
            <ListItem>
              Visit our website at
              {' '}
              <Link as={NextLink} href="/" textDecoration="underline" fontWeight="semibold">
                https://getthemenu.io
              </Link>
              , or any website of ours that links to this privacy notice
            </ListItem>
            <ListItem>
              Engage with us in other related ways, including any sales,
              marketing, or events
            </ListItem>
          </UnorderedList>
          <Text>
            <Text as="span" fontWeight="semibold">
              Questions or concerns?
            </Text>
            {' '}
            Reading this privacy notice will help you understand your privacy
            rights and choices. If you do not agree with our policies and
            practices, please do not use our Services. If you still have any
            questions or concerns, please contact us at
            {' '}
            <Link
              textDecoration="underline"
              fontWeight="semibold"
              href="mailto:info@getthemenu.io"
            >
              info@getthemenu.io
            </Link>
            .
          </Text>
        </Box>
        <Box mb="4">
          <Heading as="h2" mb="2">
            Summary Of Key Points
          </Heading>
          <Text as="i">
            This summary provides key points from our privacy notice, but you
            can find out more details about any of these topics by clicking the
            link following each key point or by using our table of contents
            below to find the section you are looking for. You can also click
            {' '}
            <Link textDecoration="underline" fontWeight="semibold" href="#toc">
              here
            </Link>
            {' '}
            to go directly to our table of contents.
          </Text>
        </Box>
        <Box mb="12">
          <VStack as="dl" spacing="6" mb="8" alignItems="flex-start">
            <Box>
              <Text as="dt" fontWeight="semibold">
                What personal information do we process?
              </Text>
              <dd>
                When you visit, use, or navigate our Services, we may process
                personal information depending on how you interact with
                GetTheMenu and the Services, the choices you make, and the
                products and features you use. Click
                {' '}
                <Link
                  textDecoration="underline"
                  fontWeight="semibold"
                  href="#personalinfo"
                >
                  here
                </Link>
                {' '}
                to learn more.
              </dd>
            </Box>
            <Box>
              <Text as="dt" fontWeight="semibold">
                Do we process any sensitive personal information?
              </Text>
              <dd>We do not process sensitive personal information.</dd>
            </Box>
            <Box>
              <Text as="dt" fontWeight="semibold">
                Do we receive any information from third parties?
              </Text>
              <dd>We do not receive any information from third parties.</dd>
            </Box>
            <Box>
              <Text as="dt" fontWeight="semibold">
                How do we process your information?
              </Text>
              <dd>
                We process your information to provide, improve, and administer
                our Services, communicate with you, for security and fraud
                prevention, and to comply with law. We may also process your
                information for other purposes with your consent. We process
                your information only when we have a valid legal reason to do
                so. Click
                {' '}
                <Link
                  textDecoration="underline"
                  fontWeight="semibold"
                  href="#2-how-do-we-process-your-information"
                >
                  here
                </Link>
                {' '}
                to learn more.
              </dd>
            </Box>
            <Box>
              <Text as="dt" fontWeight="semibold">
                In what situations and with which parties do we share personal
                information?
              </Text>
              <dd>
                We may share information in specific situations and with
                specific third parties. Click
                {' '}
                <Link
                  textDecoration="underline"
                  fontWeight="semibold"
                  href="#3-when-and-with-whom-do-we-share-your-personal-information"
                >
                  here
                </Link>
                {' '}
                to learn more.
              </dd>
            </Box>
            <Box>
              <Text as="dt" fontWeight="semibold">
                How do we keep your information safe?
              </Text>
              <dd>
                We have organizational and technical processes and procedures in
                place to protect your personal information. However, no
                electronic transmission over the internet or information storage
                technology can be guaranteed to be 100% secure, so we cannot
                promise or guarantee that hackers, cybercriminals, or other
                unauthorized third parties will not be able to defeat our
                security and improperly collect, access, steal, or modify your
                information. Click
                {' '}
                <Link
                  textDecoration="underline"
                  fontWeight="semibold"
                  href="#6-how-do-we-keep-your-information-safe"
                >
                  here
                </Link>
                {' '}
                to learn more.
              </dd>
            </Box>
            <Box>
              <Text as="dt" fontWeight="semibold">
                What are your rights?
              </Text>
              <dd>
                Depending on where you are located geographically, the
                applicable privacy law may mean you have certain rights
                regarding your personal information. Click
                {' '}
                <Link
                  textDecoration="underline"
                  fontWeight="semibold"
                  href="#8-what-are-your-privacy-rights"
                >
                  here
                </Link>
                {' '}
                to learn more.
              </dd>
            </Box>
            <Box>
              <Text as="dt" fontWeight="semibold">
                How do you exercise your rights?
              </Text>
              <dd>
                The easiest way to exercise your rights by contacting us at
                {' '}
                <Link
                  textDecoration="underline"
                  fontWeight="semibold"
                  href="mailto:info@getthemenu.io"
                >
                  info@getthemenu.io
                </Link>
                . We will consider and act upon any request in accordance with
                applicable data protection laws.
              </dd>
            </Box>
          </VStack>
          <Text>
            Want to learn more about what GetTheMenu does with any information
            we collect? Click
            {' '}
            <Link href="#toc">here</Link>
            {' '}
            to review the notice
            in full.
          </Text>
        </Box>
        <Box>
          <Heading id="toc" as="h2" fontSize="lg" fontWeight="bold" mb="2">
            Table Of Contents
          </Heading>
          <UnorderedList spacing="2" styleType="none" m="0">
            <ListItem>
              <Link
                textDecoration="underline"
                href="#1-what-information-do-we-collect"
              >
                1. What Information Do We Collect?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#2-how-do-we-process-your-information"
              >
                2. How Do We Process Your Information?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#3-when-and-with-whom-do-we-share-your-personal-information"
              >
                3. When And With Whom Do We Share Your Personal Information?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#4-how-do-we-handle-your-social-logins"
              >
                4. How Do We Handle Your Social Logins?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#5-how-long-do-we-keep-your-information"
              >
                5. How Long Do We Keep Your Information?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#6-how-do-we-keep-your-information-safe"
              >
                6. How Do We Keep Your Information Safe?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#7-do-we-collect-information-from-minors"
              >
                7. Do We Collect Information From Minors?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#8-what-are-your-privacy-rights"
              >
                8. What Are Your Privacy Rights?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#9-controls-for-do-not-track-feature"
              >
                9. Controls For Do-Not-Track Features
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#10-do-california-residents-have-specific-privacy-rights"
              >
                10. Do California Residents Have Specific Privacy Rights?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#11-do-we-make-updates-to-this-notice"
              >
                11. Do We Make Updates To This Notice?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#12-how-can-you-contact-us-about-this-notice"
              >
                12. How Can You Contact Us About This Notice?
              </Link>
            </ListItem>
            <ListItem>
              <Link
                textDecoration="underline"
                href="#13-how-can-you-review-update-or-delete-the-data-we-collect-from-you"
              >
                13. How Can You Review, Update, Or Delete The Data We Collect
                From You?
              </Link>
            </ListItem>
          </UnorderedList>
          <Prose>
            <Box>
              <Heading as="h2" id="1-what-information-do-we-collect">
                1. What Information Do We Collect?
              </Heading>
              <Box>
                <Heading id="personalinfo" as="h3">
                  Personal information you disclose to us
                </Heading>
                <Text>
                  <Text as="span" fontWeight="semibold">
                    In Short:
                    {' '}
                  </Text>
                  We collect personal information that you provide to us.
                </Text>
                <Text>
                  We collect personal information that you voluntarily provide
                  to us when you register on the Services, express an interest
                  in obtaining information about us or our products and
                  Services, when you participate in activities on the Services,
                  or otherwise when you contact us.
                </Text>
                <VStack as="dl" spacing="6" mb="8" alignItems="flex-start">
                  <Box>
                    <Text as="dt" fontWeight="semibold">
                      Personal Information Provided by You
                    </Text>
                    <dd>
                      The personal information that we collect depends on the
                      context of your interactions with us and the Services, the
                      choices you make, and the products and features you use.
                      The personal information we collect may include the
                      following:
                      <UnorderedList>
                        <ListItem>email addresses</ListItem>
                        <ListItem>usernames</ListItem>
                        <ListItem>passwords</ListItem>
                        <ListItem>contact preferences</ListItem>
                        <ListItem>names</ListItem>
                        <ListItem>contact or authentication data</ListItem>
                      </UnorderedList>
                    </dd>
                  </Box>

                  <Box>
                    <Text as="dt" fontWeight="semibold">
                      Sensitive Information
                    </Text>
                    <dd>We do not process sensitive information.</dd>
                  </Box>

                  <Box>
                    <Text as="dt" fontWeight="semibold">
                      Payment Data
                    </Text>
                    <dd>
                      We may collect data necessary to process your payment if
                      you make purchases, such as your payment instrument number
                      (such as a credit card number), and the security code
                      associated with your payment instrument. All payment data
                      is stored by Paddle. You may find their privacy notice
                      link(s) here:
                      {' '}
                      <Link
                        href="https://www.paddle.com/legal/privacy"
                        isExternal
                      >
                        https://www.paddle.com/legal/privacy
                      </Link>
                      .
                    </dd>
                  </Box>

                  <Box>
                    <Text as="dt" fontWeight="semibold">
                      Social Media Login Data
                    </Text>
                    <dd>
                      We may provide you with the option to register with us
                      using your existing social media account details, like
                      your Facebook, Twitter, or other social media account. If
                      you choose to register in this way, we will collect the
                      information described in the section called
                      {' '}
                      <Link href="#4-how-do-we-handle-your-social-logins">
                        &quot;How Do We Handle Your Social Logins?&quot;
                      </Link>
                      {' '}
                      below.
                    </dd>
                  </Box>
                </VStack>
                <Text>
                  All personal information that you provide to us must be true,
                  complete, and accurate, and you must notify us of any changes
                  to such personal information.
                </Text>
              </Box>
              <Box>
                <Heading as="h3">Information automatically collected</Heading>
                <Text>
                  <Text as="span" fontWeight="semibold">
                    In Short:
                    {' '}
                  </Text>
                  Some information — such as your Internet Protocol (IP) address
                  and/or browser and device characteristics — is collected
                  automatically when you visit our Services.
                </Text>
                <Text>
                  We automatically collect certain information when you visit,
                  use, or navigate the Services. This information does not
                  reveal your specific identity (like your name or contact
                  information) but may include device and usage information,
                  such as your IP address, browser and device characteristics,
                  operating system, language preferences, referring URLs, device
                  name, country, location, information about how and when you
                  use our Services, and other technical information. This
                  information is primarily needed to maintain the security and
                  operation of our Services, and for our internal analytics and
                  reporting purposes.
                </Text>
                <Text>The information we collect includes:</Text>
                <VStack as="dl" spacing="6" mb="8" alignItems="flex-start">
                  <Box>
                    <Text as="dt" fontWeight="semibold">
                      Log and Usage Data
                    </Text>
                    <dd>
                      Log and usage data is service-related, diagnostic, usage,
                      and performance information our servers automatically
                      collect when you access or use our Services and which we
                      record in log files. Depending on how you interact with
                      us, this log data may include your IP address, device
                      information, browser type, and settings and information
                      about your activity in the Services (such as the date/time
                      stamps associated with your usage, pages and files viewed,
                      searches, and other actions you take such as which
                      features you use), device event information (such as
                      system activity, error reports (sometimes called
                      &quot;crash dumps&quot;), and hardware settings).
                    </dd>
                  </Box>

                  <Box>
                    <Text as="dt" fontWeight="semibold">
                      Device Data
                    </Text>
                    <dd>
                      We collect device data such as information about your
                      computer, phone, tablet, or other device you use to access
                      the Services. Depending on the device used, this device
                      data may include information such as your IP address (or
                      proxy server), device and application identification
                      numbers, location, browser type, hardware model, Internet
                      service provider and/or mobile carrier, operating system,
                      and system configuration information.
                    </dd>
                  </Box>

                  <Box>
                    <Text as="dt" fontWeight="semibold">
                      Location Data
                    </Text>
                    <dd>
                      We collect location data such as information about your
                      device&apos;s location, which can be either precise or
                      imprecise. How much information we collect depends on the
                      type and settings of the device you use to access the
                      Services. For example, we may use GPS and other
                      technologies to collect geolocation data that tells us
                      your current location (based on your IP address). You can
                      opt out of allowing us to collect this information either
                      by refusing access to the information or by disabling your
                      Location setting on your device. However, if you choose to
                      opt out, you may not be able to use certain aspects of the
                      Services.
                    </dd>
                  </Box>
                </VStack>
              </Box>
            </Box>
            <Box>
              <Heading as="h2" id="2-how-do-we-process-your-information">
                2. How Do We Process Your Information?
              </Heading>
              <Text>
                <Text as="span" fontWeight="semibold">
                  In Short:
                  {' '}
                </Text>
                We process your information to provide, improve, and administer
                our Services, communicate with you, for security and fraud
                prevention, and to comply with law. We may also process your
                information for other purposes with your consent.
              </Text>
              <Text>
                We process your personal information for a variety of reasons,
                depending on how you interact with our Services, including:
              </Text>
              <VStack as="dl" spacing="6" mb="8" alignItems="flex-start">
                <Box>
                  <Text as="dt" fontWeight="semibold">
                    To Facilitate Account Creation And Authentication And
                    Otherwise Manage User Accounts
                  </Text>
                  <dd>
                    We may process your information so you can create and log in
                    to your account, as well as keep your account in working
                    order.
                  </dd>
                </Box>

                <Box>
                  <Text as="dt" fontWeight="semibold">
                    To Identify Usage Trends
                  </Text>
                  <dd>
                    We may process information about how you use our Services to
                    better understand how they are being used so we can improve
                    them.
                  </dd>
                </Box>

                <Box>
                  <Text as="dt" fontWeight="semibold">
                    To Determine The Effectiveness Of Our Marketing And
                    Promotional Campaigns
                  </Text>
                  <dd>
                    We may process your information to better understand how to
                    provide marketing and promotional campaigns that are most
                    relevant to you.
                  </dd>
                </Box>

                <Box>
                  <Text as="dt" fontWeight="semibold">
                    To Comply With Our Legal Obligations
                  </Text>
                  <dd>
                    We may process your information to comply with our legal
                    obligations, respond to legal requests, and exercise,
                    establish, or defend our legal rights.
                  </dd>
                </Box>
              </VStack>
            </Box>
            <Box>
              <Heading
                as="h2"
                id="3-when-and-with-whom-do-we-share-your-personal-information"
              >
                3. When And With Whom Do We Share Your Personal Information?
              </Heading>
              <Text>
                <Text as="span" fontWeight="semibold">
                  In Short:
                  {' '}
                </Text>
                We may share information in specific situations described in
                this section and/or with the following third parties.
              </Text>
              <Text>
                We may need to share your personal information in the following
                situations:
              </Text>
              <VStack as="dl" spacing="6" mb="8" alignItems="flex-start">
                <Box>
                  <Text as="dt" fontWeight="semibold">
                    Business Transfers
                  </Text>
                  <dd>
                    We may share or transfer your information in connection
                    with, or during negotiations of, any merger, sale of company
                    assets, financing, or acquisition of all or a portion of our
                    business to another company.
                  </dd>
                </Box>
              </VStack>
            </Box>
            <Box>
              <Heading as="h2" id="4-how-do-we-handle-your-social-logins">
                4. How Do We Handle Your Social Logins?
              </Heading>
              <Text>
                <Text as="span" fontWeight="semibold">
                  In Short:
                  {' '}
                </Text>
                If you choose to register or log in to our services using a
                social media account, we may have access to certain information
                about you.
              </Text>
              <Text>
                Our Services offer you the ability to register and log in using
                your third-party social media account details (like your
                Facebook or Twitter logins). Where you choose to do this, we
                will receive certain profile information about you from your
                social media provider. The profile information we receive may
                vary depending on the social media provider concerned, but will
                often include your name, email address, friends list, and
                profile picture, as well as other information you choose to make
                public on such a social media platform.
              </Text>
              <Text>
                We will use the information we receive only for the purposes
                that are described in this privacy notice or that are otherwise
                made clear to you on the relevant Services. Please note that we
                do not control, and are not responsible for, other uses of your
                personal information by your third-party social media provider.
                We recommend that you review their privacy notice to understand
                how they collect, use, and share your personal information, and
                how you can set your privacy preferences on their sites and
                apps.
              </Text>
            </Box>
            <Box>
              <Heading as="h2" id="5-how-long-do-we-keep-your-information">
                5. How Long Do We Keep Your Information?
              </Heading>
              <Text>
                <Text as="span" fontWeight="semibold">
                  In Short:
                  {' '}
                </Text>
                We keep your information for as long as necessary to fulfill the
                purposes outlined in this privacy notice unless otherwise
                required by law.
              </Text>
              <Text>
                We will only keep your personal information for as long as it is
                necessary for the purposes set out in this privacy notice,
                unless a longer retention period is required or permitted by law
                (such as tax, accounting, or other legal requirements). No
                purpose in this notice will require us keeping your personal
                information for longer than the period of time in which users
                have an account with us.
              </Text>
              <Text>
                When we have no ongoing legitimate business need to process your
                personal information, we will either delete or anonymize such
                information, or, if this is not possible (for example, because
                your personal information has been stored in backup archives),
                then we will securely store your personal information and
                isolate it from any further processing until deletion is
                possible.
              </Text>
            </Box>
            <Box>
              <Heading as="h2" id="6-how-do-we-keep-your-information-safe">
                6. How Do We Keep Your Information Safe?
              </Heading>
              <Text>
                <Text as="span" fontWeight="semibold">
                  In Short:
                  {' '}
                </Text>
                We aim to protect your personal information through a system of
                organizational and technical security measures.
              </Text>
              <Text>
                We have implemented appropriate and reasonable technical and
                organizational security measures designed to protect the
                security of any personal information we process. However,
                despite our safeguards and efforts to secure your information,
                no electronic transmission over the Internet or information
                storage technology can be guaranteed to be 100% secure, so we
                cannot promise or guarantee that hackers, cybercriminals, or
                other unauthorized third parties will not be able to defeat our
                security and improperly collect, access, steal, or modify your
                information. Although we will do our best to protect your
                personal information, transmission of personal information to
                and from our Services is at your own risk. You should only
                access the Services within a secure environment.
              </Text>
            </Box>
            <Box>
              <Heading as="h2" id="7-do-we-collect-information-from-minors">
                7. Do We Collect Information From Minors?
              </Heading>
              <Text>
                <Text>
                  <Text as="span" fontWeight="semibold">
                    In Short:
                    {' '}
                  </Text>
                  We do not knowingly collect data from or market to children
                  under 18 years of age.
                </Text>
                <Text>
                  We do not knowingly solicit data from or market to children
                  under 18 years of age. By using the Services, you represent
                  that you are at least 18 or that you are the parent or
                  guardian of such a minor and consent to such minor
                  dependent&apos;s use of the Services. If we learn that
                  personal information from users less than 18 years of age has
                  been collected, we will deactivate the account and take
                  reasonable measures to promptly delete such data from our
                  records. If you become aware of any data we may have collected
                  from children under age 18, please contact us at
                  <Link href="mailto:info@getthemenu.io">
                    info@getthemenu.io
                  </Link>
                  .
                </Text>
              </Text>
            </Box>
            <Box>
              <Heading as="h2" id="8-what-are-your-privacy-rights">
                8. What Are Your Privacy Rights?
              </Heading>
              <Text>
                <Text as="span" fontWeight="semibold">
                  In Short:
                  {' '}
                </Text>
                You may review, change, or terminate your account at any time.
              </Text>
              <Text>
                If you are located in the EEA or UK and you believe we are
                unlawfully processing your personal information, you also have
                the right to complain to your local data protection supervisory
                authority. You can find their contact details here:
                {' '}
                <Link
                  href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
                  isExternal
                >
                  https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
                </Link>
                .
              </Text>
              <Text>
                If you are located in Switzerland, the contact details for the
                data protection authorities are available here:
                {' '}
                <Link
                  href="https://www.edoeb.admin.ch/edoeb/en/home.html"
                  isExternal
                >
                  https://www.edoeb.admin.ch/edoeb/en/home.html
                </Link>
                .
              </Text>
              <Box>
                <Heading as="h3">Withdrawing your consent</Heading>
                <Text>
                  If we are relying on your consent to process your personal
                  information, which may be express and/or implied consent
                  depending on the applicable law, you have the right to
                  withdraw your consent at any time. You can withdraw your
                  consent at any time by contacting us by using the contact
                  details provided in the section
                  {' '}
                  <Link href="#12-how-can-you-contact-us-about-this-notice">
                    &quot;How Can You Contact Us About This Notice?&quot;
                  </Link>
                  {' '}
                  below.
                </Text>
                <Text>
                  However, please note that this will not affect the lawfulness
                  of the processing before its withdrawal, nor when applicable
                  law allows, will it affect the processing of your personal
                  information conducted in reliance on lawful processing grounds
                  other than consent.
                </Text>
              </Box>
              <Box>
                <Heading as="h3">
                  Opting out of marketing and promotional communications
                </Heading>
                <Text>
                  You can unsubscribe from our marketing and promotional
                  communications at any time by clicking on the unsubscribe link
                  in the emails that we send, or by contacting us using the
                  details provided in the section
                  {' '}
                  <Link href="#12-how-can-you-contact-us-about-this-notice">
                    &quot;How Can You Contact Us About This Notice?&quot;
                  </Link>
                  {' '}
                  below. You will then be removed from the marketing lists.
                  However, we may still communicate with you — for example, to
                  send you service-related messages that are necessary for the
                  administration and use of your account, to respond to service
                  requests, or for other non-marketing purposes.
                </Text>
              </Box>
              <Box>
                <Heading as="h3">Account Information</Heading>
                <Text>
                  If you would at any time like to review or change the
                  information in your account or terminate your account, you
                  can: Log in to your account settings and update your user
                  account. Contact us using the contact information provided.
                  Upon your request to terminate your account, we will
                  deactivate or delete your account and information from our
                  active databases. However, we may retain some information in
                  our files to prevent fraud, troubleshoot problems, assist with
                  any investigations, enforce our legal terms and/or comply with
                  applicable legal requirements. If you have questions or
                  comments about your privacy rights, you may email us at
                  {' '}
                  <Link href="mailto:info@getthemenu.io">
                    info@getthemenu.io
                  </Link>
                  .
                </Text>
              </Box>
            </Box>
            <Box>
              <Heading as="h2" id="9-controls-for-do-not-track-feature">
                9. Controls For Do-Not-Track Features
              </Heading>
              <Text>
                Most web browsers and some mobile operating systems and mobile
                applications include a Do-Not-Track (&quot;DNT&quot;) feature or
                setting you can activate to signal your privacy preference not
                to have data about your online browsing activities monitored and
                collected. At this stage no uniform technology standard for
                recognizing and implementing DNT signals has been finalized. As
                such, we do not currently respond to DNT browser signals or any
                other mechanism that automatically communicates your choice not
                to be tracked online. If a standard for online tracking is
                adopted that we must follow in the future, we will inform you
                about that practice in a revised version of this privacy notice.
              </Text>
            </Box>
            <Box>
              <Heading
                as="h2"
                id="10-do-california-residents-have-specific-privacy-rights"
              >
                10. Do California Residents Have Specific Privacy Rights?
              </Heading>
              <Text>
                <Text>
                  <Text as="span" fontWeight="semibold">
                    In Short:
                    {' '}
                  </Text>
                  Yes, if you are a resident of California, you are granted
                  specific rights regarding access to your personal information.
                </Text>
                <Text>
                  California Civil Code Section 1798.83, also known as the
                  &quot;Shine The Light&quot; law, permits our users who are
                  California residents to request and obtain from us, once a
                  year and free of charge, information about categories of
                  personal information (if any) we disclosed to third parties
                  for direct marketing purposes and the names and addresses of
                  all third parties with which we shared personal information in
                  the immediately preceding calendar year. If you are a
                  California resident and would like to make such a request,
                  please submit your request in writing to us using the contact
                  information provided below.
                </Text>
                <Text>
                  If you are under 18 years of age, reside in California, and
                  have a registered account with Services, you have the right to
                  request removal of unwanted data that you publicly post on the
                  Services. To request removal of such data, please contact us
                  using the contact information provided below and include the
                  email address associated with your account and a statement
                  that you reside in California. We will make sure the data is
                  not publicly displayed on the Services, but please be aware
                  that the data may not be completely or comprehensively removed
                  from all our systems (e.g., backups, etc.).
                </Text>
              </Text>
              <Box>
                <Heading as="h3">CCPA Privacy Notice</Heading>
                The California Code of Regulations defines a
                &quot;resident&quot; as:
                <UnorderedList>
                  <ListItem>
                    (1) every individual who is in the State of California for
                    other than a temporary or transitory purpose and
                  </ListItem>
                  <ListItem>
                    (2) every individual who is domiciled in the State of
                    California who is outside the State of California for a
                    temporary or transitory purpose
                  </ListItem>
                </UnorderedList>
                <Text>
                  <Text>
                    All other individuals are defined as
                    &quot;non-residents.&quot;
                    {' '}
                  </Text>
                  <Text>
                    If this definition of &quot;resident&quot; applies to you,
                    we must adhere to certain rights and obligations regarding
                    your personal information.
                  </Text>
                  <Heading as="h3">
                    What categories of personal information do we collect?
                  </Heading>
                  <Text>
                    We have collected the following categories of personal
                    information in the past twelve (12) months:
                  </Text>
                </Text>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Category</Th>
                      {' '}
                      <Th>Examples</Th>
                      {' '}
                      <Th>Collected</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>A. Identifiers</Td>
                      <Td>
                        Contact details, such as real name, alias, postal
                        address, telephone or mobile contact number, unique
                        personal identifier, online identifier, Internet
                        Protocol address, email address, and account name
                      </Td>
                      <Td>NO</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        B. Personal information categories listed in the
                        California Customer Records statute
                      </Td>
                      <Td>
                        Name, contact information, education, employment,
                        employment history, and financial information
                      </Td>
                      <Td>YES</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        C. Protected classification characteristics under
                        California or federal law
                      </Td>
                      <Td>Gender and date of birth</Td>
                      <Td>NO</Td>
                    </Tr>
                    <Tr>
                      <Td>D. Commercial information</Td>
                      <Td>
                        Transaction information, purchase history, financial
                        details, and payment information
                      </Td>
                      <Td>NO</Td>
                    </Tr>
                    <Tr>
                      <Td>E. Biometric information</Td>
                      <Td>Fingerprints and voiceprints</Td>
                      <Td>NO</Td>
                    </Tr>
                    <Tr>
                      <Td>F. Internet or other similar network activity</Td>
                      <Td>
                        Browsing history, search history, online behavior,
                        interest data, and interactions with our and other
                        websites, applications, systems, and advertisements
                      </Td>
                      <Td>NO</Td>
                    </Tr>
                    <Tr>
                      <Td>G. Geolocation data</Td>
                      <Td>Device location</Td>
                      <Td>YES</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        H. Audio, electronic, visual, thermal, olfactory, or
                        similar information
                      </Td>
                      <Td>
                        Images and audio, video or call recordings created in
                        connection with our business activities
                      </Td>
                      <Td>NO</Td>
                    </Tr>
                    <Tr>
                      <Td>I. Professional or employment-related information</Td>
                      <Td>
                        Business contact details in order to provide you our
                        services at a business level or job title, work history,
                        and professional qualifications if you apply for a job
                        with us
                      </Td>
                      <Td>NO</Td>
                    </Tr>
                    <Tr>
                      <Td>J. Education Information</Td>
                      <Td>Student records and directory information</Td>
                      <Td>NO</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        K. Inferences drawn from other personal information
                      </Td>
                      <Td>
                        Inferences drawn from any of the collected personal
                        information listed above to create a profile or summary
                        about, for example, an individual&apos;s preferences and
                        characteristics
                      </Td>
                      <Td>NO</Td>
                    </Tr>
                  </Tbody>
                </Table>
                <Text>
                  We may also collect other personal information outside of
                  these categories instances where you interact with us in
                  person, online, or by phone or mail in the context of:
                </Text>
                <UnorderedList>
                  <ListItem>
                    Receiving help through our customer support channels;
                  </ListItem>
                  <ListItem>
                    Participation in customer surveys or contests; and
                  </ListItem>
                  <ListItem>
                    Facilitation in the delivery of our Services and to respond
                    to your inquiries.
                  </ListItem>
                </UnorderedList>
                <Box>
                  <Heading as="h4">
                    How do we use and share your personal information?
                  </Heading>
                  <Text>
                    More information about our data collection and sharing
                    practices can be found in this privacy notice.
                  </Text>
                  <Text>
                    You may contact us by email at
                    {' '}
                    <Link href="mailto:info@getthemenu.io">
                      info@getthemenu.io
                    </Link>
                    , or by referring to the contact details at the bottom of
                    this document.
                  </Text>
                  <Text>
                    If you are using an authorized agent to exercise your right
                    to opt out we may deny a request if the authorized agent
                    does not submit proof that they have been validly authorized
                    to act on your behalf.
                  </Text>
                </Box>
                <Box>
                  <Heading as="h4">
                    Will your information be shared with anyone else?
                  </Heading>
                  <Text>
                    We may disclose your personal information with our service
                    providers pursuant to a written contract between us and each
                    service provider. Each service provider is a for-profit
                    entity that processes the information on our behalf.
                  </Text>
                  <Text>
                    We may use your personal information for our own business
                    purposes, such as for undertaking internal research for
                    technological development and demonstration. This is not
                    considered to be &quot;selling&quot; of your personal
                    information.
                  </Text>
                  <Text>
                    GetTheMenu, LLC has not disclosed or sold any personal
                    information to third parties for a business or commercial
                    purpose in the preceding twelve (12) months. GetTheMenu, LLC
                    will not sell personal information in the future belonging
                    to website visitors, users, and other consumers.
                  </Text>
                </Box>
                <Box>
                  <Heading as="h4">
                    Your rights with respect to your personal data
                  </Heading>
                  <Heading as="h5">
                    Right to request deletion of the data — Request to delete
                  </Heading>
                  <Text>
                    You can ask for the deletion of your personal information.
                    If you ask us to delete your personal information, we will
                    respect your request and delete your personal information,
                    subject to certain exceptions provided by law, such as (but
                    not limited to) the exercise by another consumer of his or
                    her right to free speech, our compliance requirements
                    resulting from a legal obligation, or any processing that
                    may be required to protect against illegal activities.
                  </Text>
                </Box>
                <Box>
                  <Heading as="h5">
                    Right to be informed — Request to know
                  </Heading>
                  <Text>
                    Depending on the circumstances, you have a right to know:
                  </Text>
                  <UnorderedList>
                    <ListItem>
                      whether we collect and use your personal information;
                    </ListItem>
                    <ListItem>
                      the categories of personal information that we collect;
                    </ListItem>
                    <ListItem>
                      the purposes for which the collected personal information
                      is used;
                    </ListItem>
                    <ListItem>
                      whether we sell your personal information to third
                      parties;
                    </ListItem>
                    <ListItem>
                      the categories of personal information that we sold or
                      disclosed for a business purpose;
                    </ListItem>
                    <ListItem>
                      the categories of third parties to whom the personal
                      information was sold or disclosed for a business purpose;
                      and
                    </ListItem>
                    <ListItem>
                      the business or commercial purpose for collecting or
                      selling personal information.
                    </ListItem>
                  </UnorderedList>
                  <Text>
                    In accordance with applicable law, we are not obligated to
                    provide or delete consumer information that is de-identified
                    in response to a consumer request or to re-identify
                    individual data to verify a consumer request.
                  </Text>
                </Box>
                <Box>
                  <Heading as="h5">
                    Right to Non-Discrimination for the Exercise of a
                    Consumer&apos;s Privacy Rights
                  </Heading>
                  <Text>
                    We will not discriminate against you if you exercise your
                    privacy rights.
                  </Text>
                </Box>
                <Box>
                  <Heading as="h5">Verification process</Heading>
                  <Text>
                    Upon receiving your request, we will need to verify your
                    identity to determine you are the same person about whom we
                    have the information in our system. These verification
                    efforts require us to ask you to provide information so that
                    we can match it with information you have previously
                    provided us. For instance, depending on the type of request
                    you submit, we may ask you to provide certain information so
                    that we can match the information you provide with the
                    information we already have on file, or we may contact you
                    through a communication method (e.g., phone or email) that
                    you have previously provided to us. We may also use other
                    verification methods as the circumstances dictate.
                  </Text>
                  <Text>
                    We will only use personal information provided in your
                    request to verify your identity or authority to make the
                    request. To the extent possible, we will avoid requesting
                    additional information from you for the purposes of
                    verification. However, if we cannot verify your identity
                    from the information already maintained by us, we may
                    request that you provide additional information for the
                    purposes of verifying your identity and for security or
                    fraud-prevention purposes. We will delete such additionally
                    provided information as soon as we finish verifying you.
                  </Text>
                </Box>
                <Box>
                  <Heading as="h5">Other privacy rights</Heading>
                  <UnorderedList>
                    <ListItem>
                      You may object to the processing of your personal
                      information.
                    </ListItem>
                    <ListItem>
                      You may request correction of your personal data if it is
                      incorrect or no longer relevant, or ask to restrict the
                      processing of the information.
                    </ListItem>
                    <ListItem>
                      You can designate an authorized agent to make a request
                      under the CCPA on your behalf. We may deny a request from
                      an authorized agent that does not submit proof that they
                      have been validly authorized to act on your behalf in
                      accordance with the CCPA.
                    </ListItem>
                    <ListItem>
                      You may request to opt out from future selling of your
                      personal information to third parties. Upon receiving an
                      opt-out request, we will act upon the request as soon as
                      feasibly possible, but no later than fifteen (15) days
                      from the date of the request submission.
                    </ListItem>
                  </UnorderedList>
                  <Text>
                    To exercise these rights, you can contact us by email at
                    {' '}
                    <Link href="mailto:info@getthemenu.io">
                      info@getthemenu.io
                    </Link>
                    , or by referring to the contact details at the bottom of
                    this document. If you have a complaint about how we handle
                    your data, we would like to hear from you.
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box>
              <Heading as="h2" id="11-do-we-make-updates-to-this-notice">
                11. Do We Make Updates To This Notice?
              </Heading>
              <Text>
                <Text as="span" fontWeight="semibold">
                  In Short:
                  {' '}
                </Text>
                Yes, we will update this notice as necessary to stay compliant
                with relevant laws.
              </Text>
              <Text>
                We may update this privacy notice from time to time. The updated
                version will be indicated by an updated &quot;Revised&quot; date
                and the updated version will be effective as soon as it is
                accessible. If we make material changes to this privacy notice,
                we may notify you either by prominently posting a notice of such
                changes or by directly sending you a notification. We encourage
                you to review this privacy notice frequently to be informed of
                how we are protecting your information.
              </Text>
            </Box>
            <Box>
              <Heading as="h2" id="12-how-can-you-contact-us-about-this-notice">
                12. How Can You Contact Us About This Notice?
              </Heading>
              <Text>
                If you have questions or comments about this notice, you may
                email us at
                {' '}
                <Link href="mailto:info@getthemenu.io">info@getthemenu.io</Link>
              </Text>
            </Box>
            <Box>
              <Heading
                as="h2"
                id="13-how-can-you-review-update-or-delete-the-data-we-collect-from-you"
              >
                13. How Can You Review, Update, Or Delete The Data We Collect
                From You?
              </Heading>
              <Text>
                Based on the applicable laws of your country, you may have the
                right to request access to the personal information we collect
                from you, change that information, or delete it. To request to
                review, update, or delete your personal information, please
                email us at
                {' '}
                <Link href="mailto:info@getthemenu">info@getthemenu</Link>
                .
              </Text>
            </Box>
          </Prose>
        </Box>
      </Container>
    </>
  )
}
