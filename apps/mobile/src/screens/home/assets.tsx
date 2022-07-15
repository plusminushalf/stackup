import React, {useState, useEffect, useMemo} from 'react';
import {Box, Button, HStack} from 'native-base';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSliders} from '@fortawesome/free-solid-svg-icons/faSliders';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {faQrcode} from '@fortawesome/free-solid-svg-icons/faQrcode';
import {RootStackParamList, HomeTabParamList, AppColors} from '../../config';
import {
  TabScreenContainer,
  TabScreenHeader,
  HomeTabTitle,
  IconButton,
  List,
  PortfolioBalance,
  PortfolioItem,
} from '../../components';
import {
  useNavigationStoreAssetsSelector,
  useSettingsStoreAssetsSelector,
  useWalletStoreAssetsSelector,
  useExplorerStoreAssetsSelector,
} from '../../state';
import {logEvent} from '../../utils/analytics';

type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<HomeTabParamList, 'Assets'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function AssetsScreen({}: Props) {
  const {
    setShowSettingsSheet,
    setShowTokenListSheet,
    setShowDepositSheet,
    setShowSelectCurrencySheet,
    setShowQRCodeSheet,
  } = useNavigationStoreAssetsSelector();
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const {
    network,
    quoteCurrency,
    timePeriod,
    currencies: enabledCurrencies,
  } = useSettingsStoreAssetsSelector();
  const {instance} = useWalletStoreAssetsSelector();
  const {
    loading: explorerLoading,
    walletBalance,
    currencies,
    fetchAddressOverview,
  } = useExplorerStoreAssetsSelector();

  const currencySet = useMemo(
    () => new Set(enabledCurrencies),
    [enabledCurrencies],
  );

  useEffect(() => {
    onRefresh();
  }, []);

  const onQRCodePress = () => {
    setShowQRCodeSheet(true);
  };

  const onSettingPress = () => {
    logEvent('SETTINGS_OPEN');
    setShowSettingsSheet(true);
  };

  const onTokenListPress = () => {
    logEvent('MANAGE_CURRENCY_OPEN');
    setShowTokenListSheet(true);
  };

  const onDepositPress = () => {
    logEvent('DEPOSIT_OPEN');
    setShowDepositSheet(true);
  };

  const onSendPress = () => {
    logEvent('SEND_SELECT_CURRENCY_OPEN');
    setShowSelectCurrencySheet(true);
  };

  const onRefresh = () => {
    fetchAddressOverview(
      network,
      quoteCurrency,
      timePeriod,
      instance.walletAddress,
    );
  };

  return (
    <TabScreenContainer>
      <TabScreenHeader>
        <IconButton icon={faBars} onPress={onSettingPress} />

        <HomeTabTitle screen="Assets" network="Polygon" />

        <IconButton icon={faQrcode} onPress={onQRCodePress} />
      </TabScreenHeader>

      <List
        onRefresh={onRefresh}
        isRefreshing={explorerLoading}
        header={
          <Box key="assets-header">
            <Box mt="20px">
              <PortfolioBalance
                previousBalance={walletBalance.previousBalance}
                currentBalance={walletBalance.currentBalance}
                currency={quoteCurrency}
                isHidden={isHidden}
                onToggleVisibility={() => setIsHidden(!isHidden)}
              />
            </Box>

            <HStack mt="33px" mb="31px" space="14px">
              <Button flex={1} onPress={onDepositPress}>
                Deposit
              </Button>

              <Button flex={1} onPress={onSendPress}>
                Send
              </Button>
            </HStack>
          </Box>
        }
        sections={[
          {
            title: '',
            data: currencies
              .filter(currency => currencySet.has(currency.currency))
              .map(currency => (
                <PortfolioItem
                  key={currency.currency}
                  currency={currency.currency}
                  quoteCurrency={currency.quoteCurrency}
                  balance={currency.balance}
                  previousBalanceInQuoteCurrency={
                    currency.previousBalanceInQuoteCurrency
                  }
                  currentBalanceInQuoteCurrency={
                    currency.currentBalanceInQuoteCurrency
                  }
                  isHidden={isHidden}
                />
              )),
          },
        ]}
        footer={
          <Button
            key="assets-footer"
            colorScheme="text"
            variant="link"
            onPress={onTokenListPress}
            _text={{color: AppColors.text[4], fontWeight: 400}}
            leftIcon={
              <FontAwesomeIcon
                icon={faSliders}
                color={AppColors.text[4]}
                size={20}
              />
            }>
            Manage currency list
          </Button>
        }
      />
    </TabScreenContainer>
  );
}
